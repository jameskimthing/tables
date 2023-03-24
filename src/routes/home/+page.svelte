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

<!-- <AddTable /> -->
<div class="text-4xl my-6">Your Tables:</div>
<div class="">
	<div
		class="flex flex-row items-center cursor-pointer px-2 py-1 border-2 border-transparent rounded w-fit hover:border-black hover:bg-gray-300"
		on:pointerup={addSingleTable}
	>
		<SvgButton type="plus" is="Add a item to this folder" />
		<div class="text-xl px-2">Add a new folder?</div>
	</div>
</div>

{#each Object.entries($tablesStore) as [table_id, table]}
	<div class="h-3" />
	<SingleTableOverview {table_id} />
{/each}
