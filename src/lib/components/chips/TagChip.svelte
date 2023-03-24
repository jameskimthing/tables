<script lang="ts">
	import { tablesStore, type SingleTag } from '$lib/tables/stores';
	import { editSingleTag } from '$lib/tables/tags';
	import Tooltip from '../Tooltip.svelte';

	// export let tag: SingleTag;
	export let tag_id: string;
	export let table_id: string;

	let tag: SingleTag;
	$: tag = $tablesStore[table_id]['tags'][tag_id];
</script>

<!-- {#if tag} -->
<div
	class="cursor-pointer border-2 border-transparent hover:border-2 hover:border-black hover:rounded"
	on:pointerup={(e) => {
		e.stopPropagation();
		editSingleTag(tag_id, table_id);
	}}
>
	<div class="group rounded bg-gray-300 font-bold text-sm w-fit">
		<div class="py-0.5 px-1 font-bold mx-1 text-sm">
			#{tag['name']}
		</div>
		<Tooltip is={tag['description']} />
	</div>
</div>
<!-- {/if} -->
