<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
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
					Enter your device details below
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-2">
					<label for="device-name" class="text-sm font-medium text-foreground">
						Device Name
					</label>
					<Input
						id="device-name"
						type="text"
						placeholder="Enter device name"
						class="w-full"
					/>
				</div>

				<div class="space-y-2">
					<label for="stop-id" class="text-sm font-medium text-foreground">
						Stop ID
					</label>
					<Input
						id="stop-id"
						type="text"
						placeholder="Enter bus stop ID"
						class="w-full"
					/>
				</div>

				<div class="space-y-2">
					<label for="location" class="text-sm font-medium text-foreground">
						Location
					</label>
					<Input
						id="location"
						type="text"
						placeholder="Enter location"
						class="w-full"
					/>
				</div>
			</CardContent>
			<CardFooter class="flex gap-4">
				<Button variant="default" class="flex-1">
					Save Configuration
				</Button>
				<Button variant="outline" class="flex-1">
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
