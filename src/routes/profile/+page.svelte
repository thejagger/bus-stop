<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data, form } = $props();
	let { session, user } = $derived(data);

	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Profile - Bus Stop</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-foreground mb-2">Profile</h1>
			<p class="text-muted-foreground">
				Manage your account settings and preferences
			</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Edit Profile</CardTitle>
				<CardDescription>
					Update your account information
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				{#if form?.success}
					<Alert>
						<AlertDescription>
							Profile updated successfully!
						</AlertDescription>
					</Alert>
				{/if}

				{#if form?.error}
					<Alert variant="destructive">
						<AlertDescription>
							{form.error}
						</AlertDescription>
					</Alert>
				{/if}

				<form id="profile-form" method="POST" action="?/update" use:enhance={handleSubmit}>
					<div class="space-y-4">
						<div class="space-y-2">
							<label for="email" class="text-sm font-medium text-foreground">
								Email
							</label>
							<Input
								id="email"
								type="email"
								value={user?.email ?? ''}
								disabled
								class="w-full bg-muted"
							/>
							<p class="text-xs text-muted-foreground">
								Email cannot be changed
							</p>
						</div>

						<div class="space-y-2">
							<label for="full-name" class="text-sm font-medium text-foreground">
								Full Name
							</label>
							<Input
								id="full-name"
								name="fullName"
								type="text"
								value={form?.fullName ?? ''}
								placeholder="Enter your full name"
								class="w-full"
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter>
				<Button 
					type="submit" 
					form="profile-form"
					variant="default" 
					disabled={loading} 
					class="w-full"
				>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</CardFooter>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Account Information</CardTitle>
				<CardDescription>
					Your account details
				</CardDescription>
			</CardHeader>
			<CardContent>
				<dl class="space-y-2">
					<div>
						<dt class="text-sm text-muted-foreground">User ID</dt>
						<dd class="text-sm font-mono text-foreground">{user?.id}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Email</dt>
						<dd class="text-sm text-foreground">{user?.email}</dd>
					</div>
				</dl>
			</CardContent>
		</Card>
	</div>
</div>
