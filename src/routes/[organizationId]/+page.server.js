import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
  const { permission } = await parent();

  if (!permission?.read) {
    throw redirect(302, `/${params.organizationId}/myCards`);
  }
};
