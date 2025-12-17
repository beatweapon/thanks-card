import { redirect } from '@sveltejs/kit';
import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getStorage } from 'firebase-admin/storage';

export const load = async ({ parent, params, cookies }) => {
  const { permission } = await parent();

  if (!permission?.read) {
    throw redirect(302, `/${params.organizationId}/myCards`);
  }

  // 年末サマリ表示判定: 12/15 - 12/31 の間か
  const now = new Date();
  const month = now.getMonth(); // 0-based
  const date = now.getDate();
  if (month === 11 && date >= 15 && date <= 31) {
    const year = now.getFullYear();
    const viewedKey = `yearSummaryViewed_${params.organizationId}_${year}`;
    const suppressedKey = `yearSummarySuppressed_${params.organizationId}_${year}`;
    const viewed = cookies.get(viewedKey);
    const suppressed = cookies.get(suppressedKey);

    if (!viewed && !suppressed) {
      // check if export file exists directly via Storage API (avoid internal fetch)
      try {
        const storage = getStorage();
        const bucket = storage.bucket(PRIVATE_STORAGE_BUCKET);
        const filePath = `organizations/${params.organizationId}/exports/${year}.tsv`;
        const file = bucket.file(filePath);
        const [exists] = await file.exists();
        if (exists) {
          throw redirect(302, `/${params.organizationId}/yearSummary`);
        }
      } catch (e) {
        // If this is a redirect thrown intentionally, rethrow it so SvelteKit can handle it.
        if (e && e.status === 302) throw e;
        console.error('[yearSummary] storage check error', e);
        // on other errors, do not redirect
      }
    }
  }
};
