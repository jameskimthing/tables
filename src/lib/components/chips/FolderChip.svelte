<script lang="ts">
	import { editSingleFolder } from '$lib/tables/folders';
	import { tablesStore, type SingleFolder } from '$lib/tables/stores';
	import Tooltip from '../Tooltip.svelte';

	// export let folder: SingleFolder;
	export let folder_id: string;
	export let table_id: string;

	let folder: SingleFolder;
	$: folder = $tablesStore[table_id]['folders'][folder_id];
</script>

<div
	class="rounded bg-gray-300 group text-sm py-0.5 px-2 font-bold mx-1 cursor-pointer"
	on:pointerup={() => editSingleFolder(folder_id, table_id)}
>
	{folder['name']}
	<Tooltip is={folder['description']} />
</div>
