<script lang="ts">
	import { alertUser } from '$lib/components/components/alert';
	import { signup } from '$lib/auth/authentication';
	import Button from '$lib/components/form/Button.svelte';
	import Field from '$lib/components/form/Field.svelte';
	export let info: { name: string; email: string; password: string };

	async function submit() {
		try {
			await signup(info);
			alertUser('info', 'Verify Email', 'We sent an email verification! Please check your email');
		} catch (error: any) {
			alertUser('error', `${error.name}: ${error.status}`, error.message);
		}
	}
</script>

<form id="form" class="flex flex-col w-fit">
	<Field is="name" {info} />
	<Field is="email" {info} />
	<Field is="password" {info} />
	<div class="h-2" />
	<div class="w-full">
		<div class="ml-auto w-fit">
			<Button {submit} />
		</div>
	</div>
</form>
