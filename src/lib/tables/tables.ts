import { getUser, supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import { tablesStore, type SingleTable } from './stores';

// Add a single table
async function addSingleTable(info: { name: string; description: string; is_public: boolean }) {
	const user_id = (await getUser()).data.user?.id;
	if (!user_id) return console.log('Ugh no user');

	const { data, error } = await supabase
		.from('Tables')
		.insert([{ ...info, made_by: user_id }])
		.select();
	if (error) throw error;

	const d = data[0];
	tablesStore.update((prevTables) => {
		prevTables[d['id']] = {
			name: info['name'],
			description: info['description'],
			folders: {},
			tags: {},
			is_public: info['is_public'],
			made_by: user_id
		};
		return prevTables;
	});
}

// Get the table info: Name, description, folders, tags (Just the overviews)
async function loadTableOverviews() {
	const user_id = (await getUser()).data.user?.id;
	if (!user_id) throw 'Nope';

	// Get tables data
	// @ts-ignore: Unreachable code error
	// const tableOverviews: SingleTable[] = [];
	const tableOverviews: { [key: string]: SingleTable } = {};
	const tableOverviewsData = await supabase
		.from('Tables')
		.select('id,name,description,is_public,made_by');
	if (tableOverviewsData['error']) throw tableOverviewsData['error'];

	for (const tableOverview of tableOverviewsData['data']) {
		// Added general table data
		const table_id = tableOverview['id'];
		const clone = { ...tableOverview };
		delete clone.id;
		tableOverviews[table_id] = { ...clone, folders: {}, tags: {} };

		// Get folders
		const foldersData = await supabase
			.from('Mod Folders')
			.select('id,name,description')
			.eq('table', table_id);
		if (foldersData['error']) throw foldersData['error'];
		for (const folder of foldersData['data']) {
			tableOverviews[table_id]['folders'][folder['id']] = {
				name: folder['name'],
				description: folder['description']
			};
		}

		// Get tags
		const tagsData = await supabase
			.from('Tags')
			.select('id,name,description')
			.eq('table', table_id);
		if (tagsData['error']) throw tagsData['error'];
		for (const tag of tagsData['data']) {
			tableOverviews[table_id]['tags'][tag['id']] = {
				name: tag['name'],
				description: tag['description']
			};
		}
	}
	tablesStore.set(tableOverviews);
}

async function loadSingleTable(table_id: string) {
	const folders = get(tablesStore)[table_id]['folders'];

	for (const folder_id of Object.keys(folders)) {
		// Get mods for each folder
		const modsData = await supabase
			.from('Mods')
			.select('id,name,description,additional_info,link,completed,created_at')
			.eq('folder', folder_id);
		if (modsData['error']) throw modsData['error'];
		folders[folder_id]['mods'] = {};

		for (const mod of modsData['data']) {
			const clone = { ...mod };
			delete clone.id;
			folders[folder_id]['mods']![mod['id']] = { ...clone, tags: [] };
		}
	}

	// Get the tags for each mod
	const tags = Object.keys(get(tablesStore)[table_id]['tags']);
	for (const tag of tags) {
		const tagMods = await supabase.from('Mod Tags').select('mod_id').eq('tag_id', tag);
		if (tagMods['error']) throw tagMods['error'];

		// Put each tag to the appropriate mods
		for (const key of tagMods['data']) {
			const modToAssignTagTo = key['mod_id'];
			for (const folder_id of Object.keys(folders)) {
				folders[folder_id]['mods']![modToAssignTagTo]['tags']!.push(tag);
			}
		}
	}

	// Update
	tablesStore.update((prevTableStore) => {
		prevTableStore[table_id]['folders'] = folders;
		return prevTableStore;
	});
}

export { addSingleTable, loadTableOverviews, loadSingleTable };
