<script lang="ts">
	import { goto } from '$app/navigation';
	import FolderChip from '$lib/components/chips/FolderChip.svelte';
	import TagChipsList from '$lib/components/chips/TagChipsList.svelte';
	// import TagChip from '$lib/components/chips/TagChip.svelte';
	// import TagChipList from '$lib/components/chips/t.svelte';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { addSingleFolder } from '$lib/tables/folders';
	import { tablesStore, type SingleTable } from '$lib/tables/stores';
	import { deleteSingleTable, editSingleTable } from '$lib/tables/tables';
	import { addSingleTag } from '$lib/tables/tags';

	// export let table: SingleTable;
	export let table_id: string;
	let table: SingleTable;
	$: table = $tablesStore[table_id];

	function clickedTable() {
		goto(`/home/tableview?id=${table_id}`);
	}
</script>

<div class="p-2 border-4 rounded border-black">
	<div class="pb-2 flex-row flex justify-between">
		<div
			class="text-2xl cursor-pointer px-2 border-2 rounded border-transparent hover:border-black hover:bg-gray-200 relative group"
			on:pointerup={clickedTable}
		>
			{table['name']}
			<div class="-ml-3">
				<Tooltip is="See Table Details" />
			</div>
		</div>
		<div class="flex flex-row">
			{#if !table['is_public']}
				<SvgButton type="private" is="This table is made private" direction="left" />
			{/if}
			<SvgButton
				type="edit"
				is="Edit table"
				click={() => editSingleTable(table_id, table)}
				direction="left"
			/>
			<SvgButton
				type="delete"
				is="Delete table"
				click={() => deleteSingleTable(table_id, table.name)}
				direction="left"
			/>
		</div>
	</div>
	<div class="border-t-2 border-black text-gray-700 pb-2">{table.description}</div>

	<div class="flex flex-row">
		<SvgButton
			type="folder"
			is="Folders within this table"
			click={() => addSingleFolder(table_id)}
		/>
		{#each Object.entries(table.folders) as [folder_id, folder]}
			<FolderChip {folder_id} {table_id} />
		{/each}
	</div>
	<div class="flex flex-row py-2">
		<SvgButton type="tag" is="Tags within this table" click={() => addSingleTag(table_id)} />
		<TagChipsList {table_id} />
	</div>
</div>
