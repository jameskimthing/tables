<script lang="ts">
	import { goto } from '$app/navigation';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import type { SingleTable } from '$lib/tables/stores';

	export let table: SingleTable;
	export let table_id: string;

	function clickedTable() {
		goto(`/home/tableview?id=${table_id}`);
	}
</script>

<div class="cursor-pointer hover:bg-gray-200" on:pointerup={clickedTable}>
	<div class="p-2 border-4 rounded border-black">
		<div class="pb-2 flex-row flex justify-between">
			<div class="text-2xl">{table.name}</div>
			<div class="flex flex-row">
				{#if table.is_public}
					<SvgButton type="private" />
				{/if}
				<SvgButton type="edit" />
				<SvgButton type="delete" />
			</div>
		</div>
		<div class="border-t-2 border-black text-gray-700 pb-2">{table.description}</div>

		<div>Folders: {JSON.stringify(table.folders)}</div>
		<div>Tags: {JSON.stringify(table.tags)}</div>
	</div>
</div>
