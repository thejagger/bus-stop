<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { addDeviceToStorage } from '$lib/utils/device-storage';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Device } from '$lib/schemas/device';

	let { data, form } = $props();
	let { mac: initialMac, secret: initialSecret } = $derived(data);

	let mac = $state(initialMac || '');
	let secret = $state(initialSecret || '');
	let loading = $state(false);
	let isFromQR = $derived(!!initialMac && !!initialSecret);

	// Sync state with data prop changes (e.g., when URL query params change)
	$effect(() => {
		if (initialMac) mac = initialMac;
		if (initialSecret) secret = initialSecret;
	});

	// Handle successful form submission
	$effect(() => {
		if (form?.success && form?.device) {
			// Save device to localStorage
			const device: Device = {
				mac: form.device.mac,
				secret: form.device.secret,
				config: form.device.config || [],
				updated_at: form.device.updated_at,
			};
			addDeviceToStorage(device);

			// Redirect to map page after a short delay to show success message
			setTimeout(() => {
				goto('/map');
			}, 1000);
		}
	});

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Device Setup - Bus Stop</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-foreground mb-2">Device Setup</h1>
			<p class="text-muted-foreground">
				Configure your bus stop display device settings
			</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Device Configuration</CardTitle>
				<CardDescription>
					{#if isFromQR}
						Device information detected from QR code. Click "Add Device" to register it.
					{:else}
						Enter your device details below or scan the QR code from your device.
					{/if}
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				{#if form?.success}
					<Alert>
						<AlertDescription>
							Device added successfully! Redirecting to map...
						</AlertDescription>
					</Alert>
				{/if}

				{#if form?.error}
					<Alert variant="destructive">
						<AlertDescription>
							<strong>Error:</strong> {form.error}
							{#if form.details}
								<br />
								<span class="text-xs">{JSON.stringify(form.details)}</span>
							{/if}
						</AlertDescription>
					</Alert>
				{/if}

				<form id="device-form" method="POST" action="?/addDevice" use:enhance={handleSubmit}>
					<div class="space-y-4">
						<div class="space-y-2">
							<label for="mac" class="text-sm font-medium text-foreground">
								MAC Address
							</label>
							<Input
								id="mac"
								name="mac"
								type="text"
								bind:value={mac}
								placeholder="Enter device MAC address"
								disabled={isFromQR}
								class="w-full"
								required
							/>
							{#if isFromQR}
								<p class="text-xs text-muted-foreground">
									MAC address from QR code (read-only)
								</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="secret" class="text-sm font-medium text-foreground">
								Secret
							</label>
							<Input
								id="secret"
								name="secret"
								type="text"
								bind:value={secret}
								placeholder="Enter device secret"
								disabled={isFromQR}
								class="w-full"
								required
							/>
							{#if isFromQR}
								<p class="text-xs text-muted-foreground">
									Secret from QR code (read-only)
								</p>
							{:else}
								<p class="text-xs text-muted-foreground">
									The secret is displayed on your device's screen
								</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label class="text-sm font-medium text-foreground">
								Configuration
							</label>
							<div class="p-4 bg-muted rounded-md">
								<p class="text-sm text-muted-foreground">
									Device configuration will be set up on the map page after adding the device.
									You can add multiple stop-route pairs for this device.
								</p>
							</div>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter class="flex gap-4">
				<Button 
					type="submit" 
					form="device-form"
					variant="default" 
					disabled={loading || !mac || !secret} 
					class="flex-1"
				>
					{loading ? 'Adding Device...' : 'Add Device'}
				</Button>
				<Button 
					variant="outline" 
					href="/"
					class="flex-1"
				>
					Cancel
				</Button>
			</CardFooter>
		</Card>

		<Alert>
			<AlertDescription>
				<strong>Note:</strong> This is a public setup page. You can configure your device
				without signing in. For advanced features and profile management, please sign in.
			</AlertDescription>
		</Alert>
	</div>
</div>
