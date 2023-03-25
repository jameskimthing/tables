<script lang="ts">
	import SvgButton from '$lib/components/SvgButton.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { deleteSingleFolder, editSingleFolder } from '$lib/tables/folders';
	import { addSingleMod } from '$lib/tables/mods';
	import { tablesStore, type SingleFolder } from '$lib/tables/stores';
	import SingleModView from './SingleModView.svelte';

	// export let folder: SingleFolder;
	export let folder_id: string;
	export let table_id: string;
	let folder: SingleFolder;
	$: folder = $tablesStore[table_id]['folders'][folder_id];
</script>

<div class="p-2 my-2 border-4 border-black rounded">
	<div class="pb-2 flex-row flex justify-between border-b-2 border-black">
		<div
			class="text-3xl cursor-pointer px-2 border-2 rounded border-transparent hover:border-black hover:bg-gray-200 relative group"
			on:pointerup={() => editSingleFolder(folder_id, table_id)}
		>
			{folder['name']}
			<div class="-ml-3">
				<Tooltip is="Edit folder" />
			</div>
		</div>
		<!-- <div class="text-3xl">{folder['name']}</div> -->
		<!-- <div class="flex flex-row">
			<SvgButton
				type="plus"
				is="Add a new item"
				click={() => addSingleMod(folder_id, table_id)}
				direction="left"
			/>
			<SvgButton
				type="edit"
				is="Edit Folder"
				click={() => editSingleFolder(folder_id, table_id)}
				direction="left"
			/>
			<SvgButton
				type="delete"
				is="Delete Folder"
				click={() => deleteSingleFolder(folder_id, table_id)}
				direction="left"
			/>
		</div> -->
	</div>
	<div class="text-gray-700">
		{folder['description']}
	</div>
	{#if folder['mods']}
		{#each Object.entries(folder['mods'] ?? {}) as [mod_id, mod] (mod_id)}
			<!-- <div class="my-4 mx-2"> -->
			<SingleModView {mod_id} {table_id} {folder_id} />
			<!-- </div> -->
		{/each}
	{/if}

	<div
		class="flex flex-row items-center mt-9 cursor-pointer px-2 py-1 border-2 border-transparent rounded w-fit hover:border-black hover:bg-gray-300"
		on:pointerup={() => addSingleMod(folder_id, table_id)}
	>
		<SvgButton type="plus" is="Add a item to this folder" />
		<div class="text-xl px-2 pb-1">Add a new item?</div>
	</div>
</div>
