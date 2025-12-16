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

    const [exists] = await file.exists();

    return new Response(JSON.stringify({ exists }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(JSON.stringify({ error: 'Status check failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
