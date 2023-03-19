<script lang="ts">
	import { alertUser } from '$lib/auth/alert';
	import { tablesStore } from '$lib/tables/stores';
	import { loadTableOverviews } from '$lib/tables/tables';
	import AddTable from './AddTable.svelte';
	import SingleTableOverview from './SingleTableOverview.svelte';

	(async () => {
		try {
			if (!$tablesStore) await loadTableOverviews();
		} catch (err: any) {
			alertUser('error', `Error: ${err.code}`, err.message);
		}
	})();
</script>

<div
	class="text-center text-5xl py-8 border-b-4 border-black shadow-lg bg-gray-200 fixed w-full z-10"
>
	Home Page
</div>
<div class="h-36" />
<div class="p-6">
	<AddTable />
	<div class="pt-8 text-4xl">Your Tables:</div>

	{#each Object.entries($tablesStore) as [table_id, table]}
		<div class="h-6" />
		<SingleTableOverview {table_id} {table} />
	{/each}
</div>
