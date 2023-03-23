<script lang="ts">
	import TagChipsList from '$lib/components/chips/TagChipsList.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	// import TagChipList from '$lib/components/chips/t.svelte';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { deleteSingleMod, editSingleMod } from '$lib/tables/mods';
	import { tablesStore, type SingleMod } from '$lib/tables/stores';

	export let table_id: string;
	export let folder_id: string;
	export let mod_id: string;
	// export let mod: SingleMod;

	let mod: SingleMod;
	$: mod = $tablesStore[table_id]['folders'][folder_id]['mods']![mod_id];

	function openLink(link: string) {
		window?.open(link, '_blank')?.focus();
	}
</script>

<div class="flex flex-row">
	<div class="mt-2">
		<Checkbox
			info={{
				checked: ($tablesStore[table_id]['folders'][folder_id]['mods'] ?? {})[mod_id]['completed']
			}}
		/>
	</div>
	<div class="pl-3">
		<div class="flex flex-row">
			<div class="text-lg">{mod.name}</div>
			{#if mod.link}
				<SvgButton type="external_link" is={mod.link} scale={0.8} click={openLink} />
			{/if}
			<div class="p-2">
				{#if mod.tags}
					<TagChipsList {table_id} {folder_id} {mod_id} />
					<!-- <TagChipList tagsList={mod.tags} {table_id} /> -->
					<!-- <TagChipList {tagsList} {table_id} /> -->
				{/if}
			</div>
			<SvgButton
				type="edit"
				is="Edit item"
				click={() => editSingleMod(mod_id, folder_id, table_id)}
			/>
			<SvgButton
				type="delete"
				is="Delete item"
				click={() => deleteSingleMod(mod_id, folder_id, table_id)}
			/>
		</div>
		<div class="">{mod.description ?? ''}</div>
		<div class="text-gray-700 italic">{mod.additional_info ?? ''}</div>
	</div>
</div>
