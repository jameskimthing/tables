<script lang="ts">
	import TagChipsList from '$lib/components/chips/TagChipsList.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	// import TagChipList from '$lib/components/chips/t.svelte';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { editSingleMod } from '$lib/tables/mods';
	import { tablesStore, type SingleMod } from '$lib/tables/stores';

	export let table_id: string;
	export let folder_id: string;
	export let mod_id: string;
	// export let mod: SingleMod;

	let mod: SingleMod;
	$: mod = $tablesStore[table_id]['folders'][folder_id]['mods']![mod_id];

	function clickLink(e: any) {
		e.stopPropagation();

		let url = mod['link'];
		if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
		window?.open(url, '_blank');
	}
</script>

<div
	class="w-full my-3 rounded flex flex-row items-center py-1 pb-3 cursor-pointer select-none hover:bg-slate-300"
	on:pointerup={() => editSingleMod(mod_id, folder_id, table_id)}
>
	<!-- Checkbox -->
	<div class="px-2">
		<Checkbox
			info={{
				checked: ($tablesStore[table_id]['folders'][folder_id]['mods'] ?? {})[mod_id]['completed']
			}}
		/>
	</div>

	<!-- Description && Options -->
	<div class="w-full">
		<div class="flex flex-row justify-between items-center">
			<!-- Name && Link && Tags -->
			<div class="w-full flex flex-row items-center">
				<div class="text-xl font-bold">{mod['name']}</div>
				{#if mod['link']}
					<SvgButton type="external_link" is={mod['link']} scale={0.8} click={clickLink} />
				{/if}

				{#if mod['tags']}
					<div class="w-4" />
					<TagChipsList {table_id} {folder_id} {mod_id} />
				{/if}
			</div>

			<!-- Options -->
			<!-- <div class="flex flex-row pr-1">
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
			</div> -->
		</div>
		<!-- <div class="h-0.5 w-full bg-black" /> -->
		<div>
			<div class="">{mod.description ?? ''}</div>
			<div class="text-gray-700 italic">{mod.additional_info ?? ''}</div>
		</div>
	</div>
</div>

<!-- <div class="flex flex-row w-full bg-red-200">
	<div class="mt-2">
		<Checkbox
			info={{
				checked: ($tablesStore[table_id]['folders'][folder_id]['mods'] ?? {})[mod_id]['completed']
			}}
		/>
	</div>
	<div class="flex flex-row">
		<div class="flex flex-col">
			<div class="flex flex-row">
				<div class="text-lg font-bold">{mod.name}</div>
				{#if mod.link}
					<SvgButton type="external_link" is={mod.link} scale={0.8} click={openLink} />
				{/if}
			</div>
			{#if mod.tags}
				<TagChipsList {table_id} {folder_id} {mod_id} />
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
</div> -->
