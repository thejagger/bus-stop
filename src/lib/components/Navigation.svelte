<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';
	import type { SupabaseClient } from '@supabase/supabase-js';

	interface Props {
		session: Session | null;
		supabase: SupabaseClient;
	}

	let { session, supabase }: Props = $props();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/');
	};
</script>

<nav class="border-b border-border bg-background">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-6">
				<a href="/" class="text-lg font-semibold text-foreground hover:text-primary">
					Bus Stop
				</a>
				<div class="flex items-center gap-4">
					<a href="/setup" class="text-sm text-foreground hover:text-primary transition-colors">
						Setup
					</a>
					{#if session}
						<a href="/profile" class="text-sm text-foreground hover:text-primary transition-colors">
							Profile
						</a>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-4">
				{#if session}
					<span class="text-sm text-muted-foreground">{session.user.email}</span>
					<Button variant="outline" size="sm" onclick={handleSignOut}>
						Sign Out
					</Button>
				{:else}
					<Button variant="default" size="sm" href="/">
						Sign In
					</Button>
				{/if}
			</div>
		</div>
	</div>
</nav>
