<script lang="ts">
	import TagChipsList from '$lib/components/chips/TagChipsList.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	import SvgButton from '$lib/components/SvgButton.svelte';
	import { editSingleMod, toggleCheckbox } from '$lib/tables/mods';
	import { tablesStore, type SingleMod } from '$lib/tables/stores';

	export let table_id: string;
	export let folder_id: string;
	export let mod_id: string;

	let mod: SingleMod;
	$: mod = $tablesStore[table_id]['folders'][folder_id]['mods']![mod_id];

	let checkedObject = {
		checked: ($tablesStore[table_id]['folders'][folder_id]['mods'] ?? {})[mod_id]['completed']
	};

	function clickLink(e: any) {
		e.stopPropagation();

		let url = mod['link'];
		if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
		window?.open(url, '_blank');
	}

	async function clickCheckbox() {
		const completed = checkedObject['checked'];
		tablesStore.update((t) => {
			t[table_id]['folders'][folder_id]['mods']![mod_id]['completed'] = completed;
			return t;
		});
		await toggleCheckbox(mod_id, completed);
	}
</script>

<div
	class="w-full my-3 rounded flex flex-row items-center py-1 pb-3 cursor-pointer select-none hover:bg-slate-300"
	on:pointerup={() => editSingleMod(mod_id, folder_id, table_id)}
>
	<!-- Checkbox -->
	<div class="px-2">
		<Checkbox info={checkedObject} onToggle={clickCheckbox} />
		<!-- onClick={() => clickCheckbox(true)}
			onUnclick={() => clickCheckbox(false)} -->
	</div>

	<div class="w-full">
		<div class="flex flex-row justify-between items-center">
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
		</div>
		<div>
			<div class="">{mod.description ?? ''}</div>
			<div class="text-gray-700 italic">{mod.additional_info ?? ''}</div>
		</div>
	</div>
</div>
