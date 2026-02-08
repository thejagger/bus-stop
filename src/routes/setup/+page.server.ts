import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Public route - no authentication required
	return {};
};
