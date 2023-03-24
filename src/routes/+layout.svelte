<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import Popup from '$lib/components/form/Popup.svelte';
	import '../app.css';
</script>

<div class="px-4">
	<slot />
</div>

<Popup />
<Alert />
