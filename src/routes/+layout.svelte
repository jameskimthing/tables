<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import { alertUser } from '$lib/components/components/alert';
	import Popup from '$lib/components/form/Popup.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		window.onerror = function (msg, url, line, col, error: any) {
			let title: string;
			if (error?.message) title = error.message;
			else if (error?.name) title = error.name;
			else title = 'Error!';

			let body: string;
			if (error?.cause) body = JSON.stringify(error.cause);
			else if (error?.detail) body = error.detail;
			else body = 'Unknown error';

			alertUser('error', title, body);
		};

		window.onunhandledrejection = (err) => {
			let e = err.reason;

			let title: string;
			let body: string;

			if (e) {
				if (e.message) title = e.message;
				else if (e.name) title = e.name;
				else title = 'Error';

				if (e.detail) body = e.detail;
				else body = JSON.stringify(e);
			} else {
				title = 'Error';
				body = 'An unknown error has occured';
			}

			alertUser('error', title, body);
		};
	});
</script>

<div class="px-4">
	<slot />
</div>

<Popup />
<Alert />
