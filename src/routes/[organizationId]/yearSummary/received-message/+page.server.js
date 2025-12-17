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
    return {
      receivedLongest: summary.receivedLongest,
      receivedShortest: summary.receivedShortest,
      year: summary.year,
    };
  } catch (e) {
    throw redirect(302, `/${organizationId}`);
  }
};
