<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Field from '$lib/components/Field.svelte';

	const info: { name: string; description: string } = {
		name: '',
		description: ''
	};

	let isLoading: boolean = false;
	async function submit() {
		isLoading = true;

		isLoading = false;
	}
</script>

<div class="border-2 border-black rounded p-2 w-fit">
	<div class="text-xl border-b-2 border-gray-300 mb-1">Add a folder</div>

	<form on:submit|preventDefault={submit} id="form" class="flex flex-col items-end">
		<Field is="name" {info} />
		<Field is="description" {info} />
		<div class="h-2" />
		<Button {isLoading} />
	</form>
</div>
