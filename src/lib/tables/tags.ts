import { popup, showPopup } from '$lib/components/components/popup';
import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import { tablesStore, type SingleTag } from './stores';

function filterThroughTags(name: string, table_id: string): { [key: string]: SingleTag } {
	if (!name) return {};

	const tags: { [key: string]: SingleTag } = {};
	for (const [id, tag] of Object.entries(get(tablesStore)[table_id]['tags'])) {
		if (tag['name'].includes(name)) tags[id] = tag;
	}

	return tags;
}

function tagRepeated(name: string, table_id: string): boolean {
	for (const [id, tag] of Object.entries(get(tablesStore)[table_id]['tags'])) {
		if (tag['name'] === name) return true;
	}
	return false;
}

async function addSingleTag(table_id: string, fields = { name: '', description: '' }) {
	// const fields = {
	// 	name: '',
	// 	description: ''
	// };

	let isLoading: boolean = true;
	let id: string;

	showPopup({
		title: 'Add a new tag',
		fields: fields,
		tagFieldName: 'name',
		onFieldsSubmit: async () => {
			if (tagRepeated(fields['name'], table_id)) throw 'You already have that tag!';

			const { data, error } = await supabase
				.from('Tags')
				.insert([{ ...fields, table: table_id }])
				.select();
			if (error) throw error;

			const tag_id = data[0]['id'];
			id = tag_id;

			tablesStore.update((table) => {
				table[table_id]['tags'][tag_id] = fields;
				return table;
			});

			isLoading = false;
		}
	});

	while (isLoading) {
		await new Promise((res) => setTimeout(res, 100));
	}
	return id!;
}

async function editSingleTag(tag_id: string, table_id: string) {
	const tag = get(tablesStore)[table_id]['tags'][tag_id];
	const fields = {
		name: tag['name'],
		description: tag['description']
	};

	showPopup({
		title: `Edit [${tag['name']}]`,
		fields: fields,
		tagFieldName: 'name',
		onFieldsSubmit: async () => {
			const { data, error } = await supabase
				.from('Tags')
				.update({ ...fields, table: table_id })
				.eq('id', tag_id);
			if (error) throw error;

			tablesStore.update((table) => {
				table[table_id]['tags'][tag_id] = fields;
				return table;
			});
		},
		additionalOption: {
			name: 'delete tag',
			onSubmit: async () => await deleteSingleTag(tag_id, table_id)
		}
	});
}

async function deleteSingleTag(tag_id: string, table_id: string) {
	showPopup({
		title: 'Delete the tag?',
		body: 'This effect is permanent',
		nameOfSubmit: 'delete',
		submitIsDangerous: true,
		onFieldsSubmit: async () => {
			const modTagsData = await supabase
				.from('Mod Tags')
				.delete()
				.eq('tag_id', tag_id)
				.select('mod_id');
			if (modTagsData['error']) throw modTagsData['error'];

			const tagData = await supabase.from('Tags').delete().eq('id', tag_id);
			if (tagData['error']) throw tagData['error'];

			// const mods = modTagsData[]
			// const mod_ids: string[] = [];
			// for (const mod of modTagsData['data']) {
			// 	mod_ids.push(mod['mod_id']);
			// }
			const mod_ids = modTagsData['data'].map(({ mod_id }) => mod_id as string);

			tablesStore.update((table) => {
				console.log(
					'----- Deleting tag: ' + table_id + ' - ' + table[table_id]['tags'][tag_id]['name']
				);

				// Remove the references to that tag to delete
				for (const mod_id of mod_ids) {
					for (const [folder_id, folder] of Object.entries(table[table_id]['folders'])) {
						if (!folder['mods']) continue;
						if (!folder['mods'][mod_id]) continue;
						if (!folder['mods'][mod_id]['tags']) continue;

						// remove all the mods that reference that certain tag
						folder['mods']![mod_id]['tags'] = folder['mods'][mod_id]['tags']?.filter(
							(tag) => tag !== tag_id
						);
						console.log('Changed mods: ' + JSON.stringify(folder['mods'][mod_id]['tags']));
					}
				}
				console.log('Delete tag in table');
				delete table[table_id]['tags'][tag_id];

				return table;
			});

			popup.set([]);
		}
	});
}

export { filterThroughTags };
export { addSingleTag, editSingleTag, deleteSingleTag };
