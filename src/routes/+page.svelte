<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '$lib/components/ui/card';

	let { data } = $props();
	let { session } = $derived(data);
</script>

<svelte:head>
	<title>Bus Stop - Welcome</title>
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto text-center space-y-8">
		<div class="space-y-4">
			<h1 class="text-5xl font-bold text-foreground">
				Welcome to Bus Stop
			</h1>
			<p class="text-xl text-muted-foreground">
				Manage your bus stop display devices and track arrivals
			</p>
		</div>

		{#if session}
			<Card>
				<CardContent class="pt-6">
					<p class="text-foreground mb-4">
						Welcome back, <strong>{session.user.email}</strong>!
					</p>
					<div class="flex gap-4 justify-center">
						<Button href="/profile" variant="default">
							View Profile
						</Button>
						<Button href="/setup" variant="outline">
							Device Setup
						</Button>
					</div>
				</CardContent>
			</Card>
		{:else}
			<Card>
				<CardContent class="pt-6">
					<p class="text-foreground mb-4">
						Get started by setting up your device or signing in to access your profile.
					</p>
					<div class="flex gap-4 justify-center">
						<Button href="/setup" variant="default">
							Setup Device
						</Button>
						<Button href="/" variant="outline">
							Sign In
						</Button>
					</div>
				</CardContent>
			</Card>
		{/if}

		<div class="grid md:grid-cols-2 gap-6 mt-12">
			<Card>
				<CardHeader>
					<CardTitle>Device Setup</CardTitle>
					<CardDescription>
						Configure your bus stop display device. No sign-in required.
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button href="/setup" variant="outline" size="sm">
						Go to Setup →
					</Button>
				</CardFooter>
			</Card>

			{#if session}
				<Card>
					<CardHeader>
						<CardTitle>Your Profile</CardTitle>
						<CardDescription>
							Manage your account settings and preferences.
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button href="/profile" variant="outline" size="sm">
							View Profile →
						</Button>
					</CardFooter>
				</Card>
			{:else}
				<Card>
					<CardHeader>
						<CardTitle>Sign In Required</CardTitle>
						<CardDescription>
							Sign in to access your profile and manage your devices.
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button href="/" variant="outline" size="sm">
							Sign In →
						</Button>
					</CardFooter>
				</Card>
			{/if}
		</div>
	</div>
</div>
