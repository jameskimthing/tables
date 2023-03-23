<script lang="ts">
	import { alertUser } from '$lib/components/components/alert';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { tablesStore } from '$lib/tables/stores';
	import { addSingleTable, loadTableOverviews } from '$lib/tables/tables';
	import SingleTableOverview from './SingleTableOverview.svelte';

	(async () => {
		try {
			if (Object.keys($tablesStore).length === 0) await loadTableOverviews();
		} catch (err: any) {
			alertUser('error', `Error: ${err.code}`, err.message);
		}
	})();

	// async function addTabl
</script>

<div
	class="text-center text-5xl py-8 border-b-4 border-black shadow-lg bg-gray-200 fixed w-full z-10"
>
	Home Page
</div>
<div class="h-36" />
<div class="p-6">
	<!-- <AddTable /> -->
	<div class="pt-2">
		<div
			class="flex flex-row items-center cursor-pointer px-2 py-1 border-2 border-transparent rounded w-fit hover:border-black hover:bg-gray-300"
			on:pointerup={addSingleTable}
		>
			<SvgButton type="plus" is="Add a item to this folder" />
			<div class="text-3xl px-2 pb-1">Add a new folder?</div>
		</div>
	</div>

	{#each Object.entries($tablesStore) as [table_id, table]}
		<div class="h-3" />
		<SingleTableOverview {table_id} />
	{/each}
</div>
