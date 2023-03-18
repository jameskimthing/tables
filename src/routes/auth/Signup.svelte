<script lang="ts">
	import { alertUser } from '$lib/auth/alert';
	import { signup } from '$lib/auth/authentication';
	import Button from '$lib/components/Button.svelte';
	import Field from '$lib/components/Field.svelte';
	export let info: { name: string; email: string; password: string };

	let isLoading: boolean = false;

	async function submit() {
		isLoading = true;
		try {
			await signup(info);
			alertUser('info', 'Verify Email', 'We sent an email verification! Please check your email');
		} catch (error: any) {
			alertUser('error', `${error.name}: ${error.status}`, error.message);
		}
		isLoading = false;
	}
</script>

<form on:submit|preventDefault={submit} id="form" class="flex flex-col items-end">
	<Field is="name" {info} />
	<Field is="email" {info} />
	<Field is="password" {info} />
	<div class="h-2" />
	<Button {isLoading} />
</form>
