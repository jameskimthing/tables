<script>
	import Alert from '$lib/components/Alert.svelte';
	import '../app.css';
</script>

<div class="bg-background h-screen w-screen">
	<slot />
</div>

<Alert />
