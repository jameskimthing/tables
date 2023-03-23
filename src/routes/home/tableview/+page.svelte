<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import TagChipsList from '$lib/components/chips/TagChipsList.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { addSingleFolder } from '$lib/tables/folders';
	import { tablesStore } from '$lib/tables/stores';
	import { loadSingleTable, loadTableOverviews } from '$lib/tables/tables';
	import { addSingleTag } from '$lib/tables/tags';
	import SingleFolderView from './SingleFolderView.svelte';

	const table_id = $page.url.searchParams.get('id');
	if (!table_id) throw 'NO ID?';

	let isLoading: boolean = false;

	(async () => {
		isLoading = true;
		console.log('Loading start!');
		if (!$tablesStore[table_id]) await loadTableOverviews();

		const folders = $tablesStore[table_id]['folders'];

		const firstFolderId: string = Object.keys($tablesStore[table_id]['folders'])[0];
		const notLoadedYet: boolean = !!$tablesStore[table_id]['folders'][firstFolderId]['mods'];
		const foldersExist: boolean = Object.keys(folders).length !== 0;
		if (foldersExist && notLoadedYet) await loadSingleTable(table_id);

		isLoading = false;
	})();
</script>

<Button submit={() => goto('/home')} name="Go back" />
<Button submit={() => addSingleTag(table_id)} name="Add a tag" />

<div class="flex flex-row py-2">
	<SvgButton type="tag" is="Tags within this table" />
	{#if !isLoading}
		<TagChipsList {table_id} />
	{/if}
</div>

<div class="pt-2">
	<div
		class="flex flex-row items-center cursor-pointer px-2 py-1 border-2 border-transparent rounded w-fit hover:border-black hover:bg-gray-300"
		on:pointerup={() => addSingleFolder(table_id)}
	>
		<SvgButton type="plus" is="Add a item to this folder" />
		<div class="text-3xl px-2 pb-1">Add a new folder?</div>
	</div>
</div>

{#if !isLoading}
	{#each Object.entries($tablesStore[table_id]['folders']) as [folder_id, folder] (folder_id)}
		<SingleFolderView {table_id} {folder_id} />
	{/each}
{/if}
