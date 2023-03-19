<script lang="ts">
	import { alertUser } from '$lib/auth/alert';
	import Button from '$lib/components/Button.svelte';
	import Field from '$lib/components/Field.svelte';
	import { addSingleTable } from '$lib/tables/tables';

	const info: {
		name: string;
		description: string;
		is_public: boolean;
	} = {
		name: '',
		description: '',
		is_public: false
	};

	let isLoading: boolean = false;
	async function submit() {
		isLoading = true;
		try {
			await addSingleTable(info);
			alertUser(
				'success',
				`Added table: ${info['name']}`,
				'The table has been successfully registered'
			);
		} catch (err: any) {
			alertUser('error', `Error: ${err.code}`, err.message);
		}
		isLoading = false;
	}
</script>

<div class="border-2 border-black rounded p-2 w-fit">
	<div class="text-xl border-b-2 border-gray-300 mb-1">Add a table</div>

	<form on:submit|preventDefault={submit} id="form" class="flex flex-col items-end">
		<Field is="name" {info} />
		<Field is="description" {info} />
		<label class="py-2 left-0 w-full">
			<input type="checkbox" bind:checked={info['is_public']} class="accent-dark w-4 h-4" />
			Make the table public?
		</label>
		<div class="h-2" />
		<Button {isLoading} />
	</form>
</div>
