<script lang="ts">
	import { page } from '$app/stores';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { addSingleFolder } from '$lib/tables/folders';
	import { tablesStore } from '$lib/tables/stores';
	import { loadSingleTable, loadTableOverviews } from '$lib/tables/tables';
	import Menubar from './Menubar.svelte';
	import SingleFolderView from './SingleFolderView.svelte';

	const table_id = $page.url.searchParams.get('id');
	if (!table_id) throw 'NO ID?';

	let isLoadingTableOverviews: boolean = false;

	(async () => {
		isLoadingTableOverviews = true;
		if (!$tablesStore[table_id]) await loadTableOverviews();
		isLoadingTableOverviews = false;

		// const folders = $tablesStore[table_id]['folders'];

		const firstId: string = Object.keys($tablesStore[table_id]['folders'])[0];
		if (!firstId) return;
		const isLoaded: boolean = !!$tablesStore[table_id]['folders'][firstId]['mods'];
		if (!isLoaded) await loadSingleTable(table_id);
	})();
</script>

{#if !isLoadingTableOverviews}
	<Menubar {table_id} />
{/if}

<!-- <Button submit={() => goto('/home')} name="Go back" /> -->

<!-- <div class="text-5xl pt-6 pb-2">
	{#if !isLoadingTableOverviews}
		{'Table: ' + ($tablesStore[table_id] ?? { name: '' })['name']}
	{/if}
</div> -->

<!-- <div class="flex flex-row items-center ml-2 pb-5">
	<SvgButton type="tag" is="Add a new tag?" click={() => addSingleTag(table_id)} />
	{#if !isLoadingTableOverviews}
		<TagChipsList {table_id} />
	{/if}
</div> -->

<div class="">
	<div
		class="flex flex-row items-center cursor-pointer px-2 py-1 border-2 border-transparent rounded w-fit hover:border-black hover:bg-gray-300"
		on:pointerup={() => addSingleFolder(table_id)}
	>
		<SvgButton type="plus" is="Add a item to this folder" />
		<div class="text-xl px-2 pb-1">Add a new folder?</div>
	</div>
</div>

{#if !isLoadingTableOverviews}
	{#each Object.entries($tablesStore[table_id]['folders']) as [folder_id, folder] (folder_id)}
		<SingleFolderView {table_id} {folder_id} />
	{/each}
{/if}
