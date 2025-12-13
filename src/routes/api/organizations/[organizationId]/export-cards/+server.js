import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export const GET = async ({ request, params }) => {
  const db = getFirestore();
  const { organizationId } = params;

  // year パラメータを取得
  const url = new URL(request.url);
  const year = parseInt(url.searchParams.get('year'), 10);

  // バリデーション
  if (isNaN(year) || year < 2024) {
    return new Response('Invalid year parameter', { status: 400 });
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
    ];
    const rows = [headers.join('\t')];

    cardsSnapshot.forEach((doc) => {
      const card = doc.data();
      const fromName = memberMap[card.from] || '（削除）';
      const toName = memberMap[card.to] || '（削除）';
      const reactions = Array.isArray(card.reactions) ? card.reactions : [];
      const reactionsCount = reactions.length;
      const reactionsJson = escapeTabNewline(JSON.stringify(reactions));

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
      ];

      rows.push(row.join('\t'));
    });

    const tsvContent = rows.join('\n');

    return new Response(tsvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/tab-separated-values; charset=utf-8',
        'Content-Disposition': `attachment; filename="thanks-cards-${organizationId}-${year}.tsv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response('Export failed', { status: 500 });
  }
};

/**
 * @param {string} str
 */
function escapeTabNewline(str) {
  if (!str) return '';
  return str.replace(/\t/g, ' ').replace(/\n/g, ' ');
}
