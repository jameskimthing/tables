<script lang="ts">
	import { tablesStore, type SingleTable } from '$lib/tables/stores';
	import TagChip from './TagChip.svelte';

	// There are 3 ways to have tagChipsList
	// 1: Tags from table
	// 2: Tags from mod (and folder)
	// 3: Custom tags

	export let table_id: string;

	export let folder_id: string = '';
	export let mod_id: string = '';

	export let customTagsList: string[] = [];

	let tagsList: string[] = setTagList($tablesStore[table_id]);
	$: tagsList = setTagList($tablesStore[table_id]);
	function setTagList(table: SingleTable): string[] {
		if (mod_id && folder_id) return table['folders'][folder_id]['mods']![mod_id]['tags'] ?? [];
		if (customTagsList.length !== 0) return customTagsList;
		return Object.keys(table['tags']);
	}
</script>

{#each tagsList as tag_id (tag_id)}
	<div class="p-1 flex flex-row">
		<TagChip {tag_id} {table_id} />
	</div>
{/each}
