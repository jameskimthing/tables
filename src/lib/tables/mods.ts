import { showPopup } from '$lib/components/components/popup';
import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import { tablesStore } from './stores';

async function addSingleMod(folder_id: string, table_id: string) {
	const fields = {
		name: '',
		description: '',
		additional_info: '',
		link: ''
		// completed: false,
		// folder: folder_id,
	};

	const choiceFields = [
		{
			list: get(tablesStore)[table_id]['tags'],
			choices: [],
			description: 'Tags:',
			choseNotPresent: () => console.log('That does not exist!')
		}
	];

	const booleanFields = [
		{
			id: 'completed',
			description: 'Set item as completed?',
			checked: false
		}
	];

	const folder_name = get(tablesStore)[table_id]['folders'][folder_id]['name'];
	showPopup({
		title: 'Add a new item inside ' + folder_name,
		body: 'Fill the following:',
		fields: fields,
		boolean: booleanFields,
		chooseFrom: choiceFields,
		table_id: table_id,
		onFieldsSubmit: async () => {
			console.log('SUBMIT!');

			// Insert mods
			const modsData = await supabase
				.from('Mods')
				.insert([
					{
						...fields,
						folder: folder_id,
						completed: booleanFields[0]['checked']
					}
				])
				.select();
			if (modsData['error']) throw modsData['error'];

			const mod_id: string = modsData['data']![0]['id'];

			const tags_to_add: { mod_id: string; tag_id: string }[] = [];
			for (const tag of choiceFields[0]['choices']) {
				tags_to_add.push({ mod_id: mod_id, tag_id: tag });
			}

			const modTagsData = await supabase.from('Mod Tags').insert(tags_to_add);
			if (modTagsData['error']) throw modTagsData['error'];

			tablesStore.update((table) => {
				if (!table[table_id]['folders'][folder_id]['mods'])
					table[table_id]['folders'][folder_id]['mods'] = {};
				table[table_id]['folders'][folder_id]['mods']![mod_id] = {
					...fields,
					completed: booleanFields[0]['checked'],
					created_at: modsData['data'][0]['created_at'],
					tags: choiceFields[0]['choices']
				};

				return table;
			});
		}
	});
}

async function editSingleMod(mod_id: string, folder_id: string, table_id: string) {
	const mod = get(tablesStore)[table_id]['folders'][folder_id]['mods']![mod_id];

	const fields = {
		name: mod['name'],
		description: mod['description'],
		additional_info: mod['additional_info'],
		link: mod['link']
	};

	const choiceFields = [
		{
			list: get(tablesStore)[table_id]['tags'],
			choices: mod['tags'] ?? [],
			description: 'Tags:',
			choseNotPresent: () => console.log('That does not exist!')
		}
	];

	const booleanFields = [
		{
			id: 'completed',
			description: 'Set item as completed?',
			checked: mod['completed']
		}
	];

	showPopup({
		title: `Edit item: ${mod['name']}`,
		body: 'Fill the following:',
		fields: fields,
		boolean: booleanFields,
		chooseFrom: choiceFields,
		table_id: table_id,
		onFieldsSubmit: async () => {
			console.log('SUBMIT!');

			// Insert mods
			// const modsData = await supabase
			// 	.from('Mods')
			// 	.insert([
			// 		{
			// 			...fields,
			// 			folder: folder_id,
			// 			completed: booleanFields[0]['checked']
			// 		}
			// 	])
			// 	.select();
			const modsData = await supabase
				.from('Mods')
				.update({
					...fields,
					folder: folder_id,
					completed: booleanFields[0]['checked']
				})
				.eq('id', mod_id)
				.select();
			if (modsData['error']) throw modsData['error'];

			// Handle tags
			// const tagsData = await supabase.from('Mod Tags').select('tag_id').eq('mod_id', mod_id);
			// if (tagsData['error']) throw tagsData['error'];

			// const preExistingTags = tagsData['data'].map((tag) => tag['tag_id'] as string);
			const preExistingTags =
				get(tablesStore)[table_id]['folders'][folder_id]['mods']![mod_id]['tags']!;
			const tagsSelected = choiceFields[0]['choices'];

			// const tagsToDelete = tagsSelected.filter((tag_id) => preExistingTags.includes(tag_id));
			const tagsToDelete = preExistingTags.filter((tag_id) => !tagsSelected.includes(tag_id));
			const tagsToAdd = tagsSelected.filter((tag_id) => !preExistingTags.includes(tag_id));

			console.log('TAGS SELECTED: ' + JSON.stringify(tagsSelected));
			console.log('Pre-existing tags: ' + JSON.stringify(preExistingTags));
			console.log('Tags to delete: ' + JSON.stringify(tagsToDelete));
			console.log('Tags to add: ' + JSON.stringify(tagsToAdd));

			for (const tag_id of tagsToDelete) {
				(async () => {
					const tagDeleted = await supabase
						.from('Mod Tags')
						.delete()
						.eq('tag_id', tag_id)
						.eq('mod_id', mod_id);
					if (tagDeleted['error']) throw tagDeleted['error'];
				})();
			}

			for (const tag_id of tagsToAdd) {
				(async () => {
					// const tag = get(tablesStore)[table_id]['tags'][tag_id];
					const tagAdded = await supabase.from('Mod Tags').insert({
						tag_id: tag_id,
						mod_id: mod_id
					});
					if (tagAdded['error']) throw tagAdded['error'];
				})();
			}

			// const tags_to_add: { mod_id: string; tag_id: string }[] = [];
			// for (const tag of choiceFields[0]['choices']) {
			// 	tags_to_add.push({ mod_id: mod_id, tag_id: tag });
			// }

			// const modTagsData = await supabase.from('Mod Tags').upsert(tags_to_add);
			// if (modTagsData['error']) throw modTagsData['error'];

			tablesStore.update((table) => {
				table[table_id]['folders'][folder_id]['mods']![mod_id] = {
					...fields,
					completed: booleanFields[0]['checked'],
					created_at: modsData['data'][0]['created_at'],
					tags: tagsSelected
				};
				console.log('Tags of this mod: ');
				console.log(table[table_id]['folders'][folder_id]['mods']![mod_id]['tags']);

				return table;
			});
		},
		additionalOption: {
			name: 'delete item',
			onSubmit: async () => await deleteSingleMod(mod_id, folder_id, table_id)
		}
	});
}

async function deleteSingleMod(mod_id: string, folder_id: string, table_id: string) {
	console.log('Deleting single MOD: ' + mod_id);
	const mod = get(tablesStore)[table_id]['folders'][folder_id]['mods']![mod_id];

	showPopup({
		title: `Delete item: ${mod['name']}`,
		body: 'This effect is PERMANENT',
		submitIsDangerous: true,
		onFieldsSubmit: async () => {
			const { data, error } = await supabase.from('Mods').delete().eq('id', mod_id);
			console.log(error);
			if (error) throw error;

			tablesStore.update((table) => {
				delete table[table_id]['folders'][folder_id]['mods']![mod_id];
				return table;
			});
		}
	});
}

export { addSingleMod, editSingleMod, deleteSingleMod };
