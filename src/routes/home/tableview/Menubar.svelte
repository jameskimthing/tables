<script lang="ts">
	import { goto } from '$app/navigation';
	import TagChipsList from '$lib/components/chips/TagChipsList.svelte';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { tablesStore } from '$lib/tables/stores';
	import { addSingleTag } from '$lib/tables/tags';

	export let table_id: string;
	// tablesStore
</script>

<div class="fixed border-b-4 border-black shadow inset-x-0 h-28">
	<div class="p-3">
		<div class="flex flex-row w-fit items-center">
			<div class="mb-1">
				<SvgButton
					scale={1.5}
					type="back"
					is="Go back to home screen?"
					click={() => goto('/home')}
				/>
			</div>
			<div class="text-4xl pb-2 ml-2">
				{($tablesStore[table_id] ?? { name: '' })['name']}
			</div>
		</div>
		<div class="flex flex-row items-center pb-5">
			<SvgButton type="tag" is="Add a new tag?" click={() => addSingleTag(table_id)} />
			<TagChipsList {table_id} />
		</div>
	</div>
</div>
<div class="h-28 mb-6" />
