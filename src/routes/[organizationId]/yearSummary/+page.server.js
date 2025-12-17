import { redirect } from '@sveltejs/kit';
import getYearSummary from '$lib/server/yearSummary';

export const load = async ({ params, locals }) => {
  const { organizationId } = params;
  const user = locals.currentUser;
  if (!user) {
    throw redirect(302, `/${organizationId}/myCards`);
  }

  const year = new Date().getFullYear();
  try {
    const summary = await getYearSummary(organizationId, year, user.uid);
    return { summary, orgId: organizationId };
  } catch (e) {
    if (e?.message === 'not_found') {
      // If there's no exported file, don't show summary — redirect to org home
      throw redirect(302, `/${organizationId}`);
    }
    console.error('yearSummary load error', e);
    throw redirect(302, `/${organizationId}`);
  }
};
