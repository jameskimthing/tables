<script lang="ts">
	import { alertUser } from '$lib/components/components/alert';
	import { signin } from '$lib/auth/authentication';
	import Button from '$lib/components/form/Button.svelte';
	import Field from '$lib/components/form/Field.svelte';
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

<form class="flex flex-col w-fit">
	<Field is="email" {info} />
	<Field is="password" {info} />
	<div class="h-2" />
	<div class="w-full">
		<div class="ml-auto w-fit">
			<Button {submit} />
		</div>
	</div>
</form>
