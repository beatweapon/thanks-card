import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { auth } from '$lib/server/firebase_server';

export const POST = async ({ request, params, cookies }) => {
  const db = getFirestore();
  const { organizationId } = params;

  // session cookie チェック（admin 権限の確認）
  const session = cookies.get('__session') || '';
  if (!session) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let decodedClaims;
  try {
    decodedClaims = await auth.verifySessionCookie(session);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const uid = decodedClaims.uid;
  const memberDoc = await db.collection(`organizations/${organizationId}/members`).doc(uid).get();
  if (!memberDoc.exists || !memberDoc.data()?.permission?.admin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // year パラメータを取得
  const url = new URL(request.url);
  const year = parseInt(url.searchParams.get('year'), 10);

  // バリデーション
  if (isNaN(year) || year < 2024) {
    return new Response(JSON.stringify({ error: 'Invalid year parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 年の範囲を設定
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    // cards を取得
    const cardsSnapshot = await db
      .collection(`organizations/${organizationId}/cards`)
      .where('createdAt', '>=', Timestamp.fromDate(startDate))
      .where('createdAt', '<', Timestamp.fromDate(endDate))
      .orderBy('createdAt')
      .get();

    // members を全件取得して uid → name のマップを作成
    const membersSnapshot = await db.collection(`organizations/${organizationId}/members`).get();

    const memberMap = {};
    membersSnapshot.forEach((doc) => {
      memberMap[doc.id] = doc.data().name || '（削除）';
    });

    // TSV を生成（リアクションを含める）
    const headers = [
      'id',
      'createdAt',
      'from',
      'fromName',
      'to',
      'toName',
      'message',
      'designId',
      'reactionsCount',
      'reactions',
      'emoji_ranking',
    ];
    const rows = [headers.join('\t')];

    cardsSnapshot.forEach((doc) => {
      const card = doc.data();
      const fromName = memberMap[card.from] || '（削除）';
      const toName = memberMap[card.to] || '（削除）';
      const reactions = Array.isArray(card.reactions) ? card.reactions : [];
      const reactionsCount = reactions.length;
      const reactionsJson = escapeTabNewline(JSON.stringify(reactions));

      // emoji_ranking: 集計済みの emoji -> count マップを生成
      const emojiCounts = {};
      reactions.forEach((r) => {
        try {
          const emoji = r?.emoji || r?.emojiText || '';
          if (!emoji) return;
          emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        } catch (e) {
          // ignore
        }
      });
      const emojiRankingJson = escapeTabNewline(JSON.stringify(emojiCounts));

      const row = [
        doc.id,
        card.createdAt.toDate().toISOString(),
        card.from,
        fromName,
        card.to,
        toName,
        escapeTabNewline(card.message || ''),
        card.designId || '',
        String(reactionsCount),
        reactionsJson,
        emojiRankingJson,
      ];

      rows.push(row.join('\t'));
    });

    const tsvContent = rows.join('\n');

    // Cloud Storage に保存
    const storage = getStorage();
    const bucket = storage.bucket(PRIVATE_STORAGE_BUCKET);
    const filePath = `organizations/${organizationId}/exports/${year}.tsv`;
    const file = bucket.file(filePath);

    await file.save(tsvContent, {
      metadata: {
        contentType: 'text/tab-separated-values; charset=utf-8',
      },
    });

    // 署名付き URL を生成（有効期限: 1時間）
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1時間
    });

    return new Response(JSON.stringify({ signedUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(JSON.stringify({ error: 'Export failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * @param {string} str
 */
function escapeTabNewline(str) {
  if (!str) return '';
  return str.replace(/\t/g, ' ').replace(/\n/g, ' ');
}
