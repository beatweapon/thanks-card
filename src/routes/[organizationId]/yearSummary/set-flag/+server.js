import { json } from '@sveltejs/kit';

/**
 * POST body: { type: 'viewed' | 'suppressed', year?: number }
 */
export const POST = async ({ request, params, cookies }) => {
  try {
    const body = await request.json();
    const { type, year } = body || {};
    const orgId = params.organizationId;
    const y = year || new Date().getFullYear();

    if (type === 'viewed') {
      const key = `yearSummaryViewed_${orgId}_${y}`;
      // persist for a year
      cookies.set(key, '1', { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return json({ ok: true });
    }

    if (type === 'suppressed') {
      const key = `yearSummarySuppressed_${orgId}_${y}`;
      // session cookie
      cookies.set(key, '1', { path: '/' });
      return json({ ok: true });
    }

    return json({ ok: false, error: 'invalid_type' }, { status: 400 });
  } catch (e) {
    console.error('[yearSummary][set-flag] error', e);
    return json({ ok: false, error: 'server_error' }, { status: 500 });
  }
};
