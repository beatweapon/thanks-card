import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getStorage } from 'firebase-admin/storage';

export const GET = async ({ params, request }) => {
  const { organizationId } = params;

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
