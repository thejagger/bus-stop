import { fail } from '@sveltejs/kit';
import { DeviceSchema } from '$lib/schemas/device';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Public route - no authentication required
	// Extract mac and secret from query parameters
	const mac = url.searchParams.get('mac') || '';
	const secret = url.searchParams.get('secret') || '';

	return {
		mac,
		secret,
	};
};

export const actions: Actions = {
	addDevice: async ({ request, locals }) => {
		const formData = await request.formData();
		const mac = formData.get('mac')?.toString() || '';
		const secret = formData.get('secret')?.toString() || '';

		// Validate input with Zod
		const validationResult = DeviceSchema.safeParse({
			mac,
			secret,
			config: [], // Start with empty config
		});

		if (!validationResult.success) {
			return fail(400, {
				error: 'Validation failed',
				details: validationResult.error.errors,
			});
		}

		// Use Supabase client from hooks.server.ts (anon role with RLS policies)
		const supabase = locals.supabase;

		// Upsert device (insert or update if MAC exists)
		const { data, error } = await supabase
			.from('devices')
			.upsert(
				{
					mac: validationResult.data.mac,
					secret: validationResult.data.secret,
					config: validationResult.data.config,
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: 'mac',
				}
			)
			.select()
			.single();

		if (error) {
			console.error('Error saving device:', error);
			return fail(500, {
				error: 'Failed to save device',
				details: error.message,
			});
		}

		return {
			success: true,
			device: data,
		};
	},
};
