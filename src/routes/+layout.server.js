export const load = async ({ locals }) => {
  return {
    currentUser: locals.currentUser,
  };
};
