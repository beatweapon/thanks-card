import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { auth } from '$lib/server/firebase_server';

export const GET = async ({ params, cookies, request }) => {
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
    const storage = getStorage();
    const bucket = storage.bucket(PRIVATE_STORAGE_BUCKET);
    const filePath = `organizations/${organizationId}/exports/${year}.tsv`;
    const file = bucket.file(filePath);

    // ファイル存在確認
    const [exists] = await file.exists();
    if (!exists) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
    console.error('Signed URL error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate signed URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
