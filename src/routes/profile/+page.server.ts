import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	// Redirect to home if not authenticated
	if (!session) {
		redirect(303, '/');
	}

	return {
		session,
		user: session.user,
	};
};

export const actions: Actions = {
	update: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();

		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;

		// Here you would typically update the user profile in the database
		// For now, we'll just return success
		// Example: await supabase.from('profiles').update({ full_name: fullName }).eq('id', session.user.id)

		return {
			success: true,
			fullName,
		};
	},
};
