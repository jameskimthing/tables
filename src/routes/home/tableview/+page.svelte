<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { tablesStore } from '$lib/tables/stores';
	import { loadSingleTable, loadTableOverviews } from '$lib/tables/tables';

	const table_id = $page.url.searchParams.get('id');
	if (!table_id) throw 'NO ID?';

	let isLoading: boolean = false;

	(async () => {
		isLoading = true;
		if (!$tablesStore[table_id]) await loadTableOverviews();

		const folders = $tablesStore[table_id]['folders'];
		if (Object.keys(folders).length === 0) return;

		if (!folders[Object.keys(folders)[0]]['mods']) await loadSingleTable(table_id);
		isLoading = false;
	})();
</script>

<Button click={() => goto('/home')} name="Go back" />

{#if !isLoading}
	{#each Object.entries($tablesStore[table_id]['folders']) as [folder_id, folder]}
		<div class="p-2 mx-4 my-2 border-4 border-black rounded">
			<div class="text-2xl">{folder['name']}</div>
			<div class="text-gray-700 border-b-2 border-black">
				{folder['description']}
			</div>
			{#if folder['mods']}
				{#each Object.entries(folder['mods']) as [mod_id, mod]}
					<div class="h-6" />
					<div class="text-xl">{mod.name ?? ''}</div>
					<div class="italic text-gray-700">{mod.description ?? ''}</div>
					<div>Additional Info: {mod.additional_info ?? ''}</div>
					<div>Link: {mod.link ?? ''}</div>
					<div>Completed: {mod.completed ?? ''}</div>
					{#if mod.tags}
						{#each mod.tags as tag}
							<div>Tags: {JSON.stringify($tablesStore[table_id]['tags'][tag])}</div>
						{/each}
					{/if}
				{/each}
			{/if}
		</div>
	{/each}
{/if}
