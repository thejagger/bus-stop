<script lang="ts">
    import "../app.css";

    import favicon from '$lib/assets/favicon.svg';
    import {invalidate} from '$app/navigation'
    import {onMount} from 'svelte'
    import Navigation from '$lib/components/Navigation.svelte';

    let {data, children} = $props();
    let {supabase, session} = $derived(data)

    onMount(() => {
        const {data} = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        })
        return () => data.subscription.unsubscribe()
    })
</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

<Navigation {session} {supabase} />

<div class="min-h-screen bg-background">
    {@render children()}
</div>
