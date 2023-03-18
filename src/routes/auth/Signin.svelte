<script lang="ts">
	import { alertUser } from '$lib/auth/alert';
	import { signin } from '$lib/auth/authentication';
	import Button from '$lib/components/Button.svelte';
	import Field from '$lib/components/Field.svelte';
	export let info: { email: string; password: string };

	let isLoading: boolean = false;

	async function submit() {
		isLoading = true;
		try {
			await signin(info);
		} catch (error: any) {
			alertUser('error', `${error.name}: ${error.status}`, error.message);
		}
		isLoading = false;
	}
</script>

<form on:submit|preventDefault={submit} class="flex flex-col items-end">
	<Field is="email" {info} />
	<Field is="password" {info} />
	<div class="h-2" />
	<Button {isLoading} />
</form>
