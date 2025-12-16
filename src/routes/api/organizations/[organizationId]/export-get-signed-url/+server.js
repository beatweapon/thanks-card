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
