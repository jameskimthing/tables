<script lang="ts">
	import { tablesStore, type SingleTag } from '$lib/tables/stores';
	import { addSingleTag, filterThroughTags } from '$lib/tables/tags';
	import TagChip from '../chips/TagChip.svelte';
	import TagChipsList from '../chips/TagChipsList.svelte';
	// import TagChipList from '../chips/t.svelte';

	export let table_id: string;
	export let choiceField: {
		list: {
			[key: string]: any;
		};
		choices?: string[] | undefined;
		description: string;
		choseNotPresent?: Function | undefined;
	};

	let text: string = '';
	let previewText: string = '';
	let chosenTags: { [key: string]: SingleTag } = {};

	$: previewText = text.toLowerCase().replaceAll(' ', '-');
	$: chosenTags = filterThroughTags(previewText, table_id);

	let showPreview: boolean = false;
	let showChoices: boolean = false;
	let isOnFocus: boolean = false;

	$: showPreview = isOnFocus && !!previewText;
	$: showChoices = isOnFocus && Object.keys(chosenTags).length !== 0;

	let selectedTags: { [key: string]: SingleTag } = {};

	if (choiceField['choices']) {
		for (const tag_id of choiceField['choices']) {
			selectedTags[tag_id] = $tablesStore[table_id]['tags'][tag_id];
		}
	}

	type itemsList = string[];

	let items: itemsList = [];
	let currentItem: number = 0;
	let currentItemId: string = '';

	function refreshItems() {
		const list: itemsList = [];
		list.push('');

		for (const key of Object.keys(chosenTags)) {
			if (selectedTags[key]) {
				delete chosenTags[key];
				continue;
			}
			list.push(key);
		}
		items = list;

		// if (currentItem >= items.length) currentItem = items.length - 1;
		// if (currentItem < 0) currentItem = 0;
		if (currentItem >= items.length || currentItem <= 0) currentItem = 1;
		if (items.length === 1) currentItem = 0;
		currentItemId = items[currentItem];
	}
	$: previewText, chosenTags, refreshItems();

	async function onKeydown(e: any) {
		e = e || window.event;
		if (e.keyCode == '40') {
			// DOWN!
			currentItem += 1;
			if (currentItem >= items.length) currentItem = 0;
			currentItemId = items[currentItem];
		} else if (e.keyCode == '38') {
			// UP!
			currentItem -= 1;
			if (currentItem < 0) currentItem = items.length - 1;
			currentItemId = items[currentItem];
		}

		if (e.keyCode == '13') {
			// Enter!
			e.preventDefault();
			if (!previewText) return;

			let tag_id: string;
			let tag_content: SingleTag;

			// Preview
			if (currentItem === 0) {
				tag_content = { name: previewText, description: '' };
				tag_id = await addSingleTag(table_id, tag_content);
			}

			// Tag
			else {
				tag_id = items[currentItem];
				tag_content = chosenTags[tag_id];
			}

			// selectedTags[currentItemId]
			// items[currentItem]['onEnter']();

			selectedTags[tag_id!] = tag_content;
			choiceField['choices'] = Object.keys(selectedTags);
			text = '';
		}
	}
</script>

<div class="flex flex-row justify-between">
	<div class="flex flex-col">
		<div>
			{choiceField['description']}
		</div>
		{#each Object.entries(selectedTags) as [tag_id, tag] (tag_id)}
			<div class="p-1">
				<div class="flex flex-row w-fit">
					<TagChip {tag_id} {table_id} />
					<div
						class="w-5 h-5 text-center align-middle rounded border-2 cursor-pointer hover:border-black hover:bg-gray-400 select-none"
						on:pointerup={() => {
							// const clone = JSON.parse(JSON.stringify(selectedTags))
							const clone = selectedTags;
							delete clone[tag_id];
							selectedTags = clone;
							refreshItems();
						}}
					>
						x
					</div>
				</div>
			</div>
		{/each}
		<!-- <TagChipsList customTagsList={Object.keys(selectedTags)} {table_id} /> -->
		<!-- <TagChipList tagsList={Object.keys(selectedTags)} {table_id} /> -->
		<!-- <div class="">{JSON.stringify(selectedTags)}</div> -->
	</div>
	<div class="flex flex-col">
		<input
			type="text"
			class="bg-white px-1 rounded border-2 border-slate-800 focus:outline-none"
			on:focus={() => (isOnFocus = true)}
			on:blur={() => (isOnFocus = false)}
			bind:value={text}
			on:keydown={onKeydown}
		/>

		{#if showPreview}
			<div
				class={'z-10 border-2 bg-white px-2 rounded shadow absolute -mt-8' +
					' ' +
					(currentItem === 0 ? 'border-black' : '')}
			>
				{previewText}
			</div>
		{/if}
		{#if showChoices}
			<div class="z-10 rounded absolute mt-8 backdrop-blur-sm">
				<div class="flex flex-col">
					{#each Object.entries(chosenTags) as [tag_id, tag]}
						<div class="pb-1">
							{#if currentItemId === tag_id}
								<div class="border-2 border-black rounded w-fit">
									<TagChip {tag_id} {table_id} />
								</div>
							{:else}
								<TagChip {tag_id} {table_id} />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
