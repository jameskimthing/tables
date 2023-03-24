import { alertUser } from '$lib/components/components/alert';
import { showPopup, type PopupInfo } from '$lib/components/components/popup';
import { getUser, supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import {
	tablesStore,
	type SingleFolder,
	type SingleMod,
	type SingleTable,
	type SingleTag
} from './stores';

// Add a single table
async function addSingleTable() {
	const user_id = (await getUser())['data']['user']?.id;
	if (!user_id) throw 'NO USER';

	const fields = {
		name: '',
		description: ''
	};
	const booleanField = {
		id: 'is_public',
		description: 'Make the table public?',
		checked: false
	};

	showPopup({
		title: 'Add a new table',
		fields: fields,
		boolean: [booleanField],
		onFieldsSubmit: async () => {
			const { data, error } = await supabase
				.from('Tables')
				.insert([
					{
						name: fields['name'],
						description: fields['description'],
						is_public: booleanField['checked'],
						made_by: user_id
					}
				])
				.select();
			if (error) throw error;

			tablesStore.update((table) => {
				table[data![0]['id']] = {
					name: fields['name'],
					description: fields['description'],
					folders: {},
					tags: {},
					is_public: booleanField['checked'],
					made_by: user_id
				};
				return table;
			});

			alertUser('success', 'Task completed', 'Successfully added table: ' + fields['name']);
		}
	});
}

async function editSingleTable(
	table_id: string,
	info: { name: string; description: string; is_public: boolean }
) {
	const fields = {
		name: info['name'],
		description: info['description']
	};

	const booleanField = {
		id: 'is_public',
		// is_public: info['is_public'],
		description: 'Make the table public?',
		checked: info['is_public']
	};

	showPopup({
		title: `Edit table: ${info['name']}`,
		fields: fields,
		boolean: [booleanField],
		onFieldsSubmit: async () => {
			const { data, error } = await supabase
				.from('Tables')
				.update({
					name: fields['name'],
					description: fields['description'],
					is_public: booleanField['checked']
				})
				.eq('id', table_id);
			if (error) throw error;

			tablesStore.update((table) => {
				table[table_id]['name'] = fields['name'];
				table[table_id]['description'] = fields['description'];
				table[table_id]['is_public'] = booleanField['checked'];

				return table;
			});

			alertUser('success', 'Task completed', 'Successfully edited table: ' + fields['name']);
		}
	});
}

async function deleteSingleTable(table_id: string, table_name: string) {
	showPopup({
		title: `Delete table: ${table_name}?`,
		body: '(This effect is PERMANENT and cannot be reversed)',
		submitIsDangerous: true,
		onFieldsSubmit: async () => {
			// Loop through all tags
			const tags = Object.keys(get(tablesStore)[table_id]['tags']);
			let tags_finished: number = 0;
			for (const tag_id of tags) {
				(async () => {
					const first = await supabase.from('Mod Tags').delete().eq('tag_id', tag_id);
					if (first['error']) throw first['error'];

					const second = await supabase.from('Tags').delete().eq('id', tag_id);
					if (second['error']) throw second['error'];
					tags_finished += 1;
				})();
			}

			const folders = Object.keys(get(tablesStore)[table_id]['folders']);
			let folders_finished: number = 0;
			for (const folder_id of folders) {
				(async () => {
					const first = await supabase.from('Mods').delete().eq('folder', folder_id);
					if (first['error']) throw first['error'];

					const second = await supabase.from('Mod Folders').delete().eq('id', folder_id);
					if (second['error']) throw second['error'];
					folders_finished += 1;
				})();
			}

			tablesStore.update((table) => {
				delete table[table_id];
				return table;
			});

			while (tags_finished !== tags.length || folders_finished !== folders.length) {
				await new Promise((res) => setTimeout(res, 100));
			}
			// let a: PostgrestError;
			const { data, error } = await supabase.from('Tables').delete().eq('id', table_id);
			if (error) throw error;

			// const deleteModTags = await supabase.from('Mod Tags').delete().eq

			// const deleteTable = await supabase.from('Tables').delete().eq('id', table_id);
			// if (deleteTable['error']) throw deleteTable['error'];

			alertUser('success', 'Task completed', 'Successfully deleted table');
		}
	});
}

// Get the table info: Name, description, folders, tags (Just the overviews)
async function loadTableOverviews() {
	const user_id = (await getUser()).data.user?.id;
	if (!user_id) throw { message: 'User not found', detail: 'user is undefined or null' };

	// Get tables data
	// const tableOverviews: SingleTable[] = [];
	// const tableOverviews: { [key: string]: SingleTable } = {};
	const tableOverviewsData = await supabase
		.from('Tables')
		.select('id,name,description,is_public,made_by');
	if (tableOverviewsData['error']) throw tableOverviewsData['error'];

	const tablesData: { [key: string]: SingleTable } = {};
	for (const table of tableOverviewsData['data']) {
		tablesData[table['id']] = {
			...table,
			folders: {},
			tags: {}
		};
	}

	tablesStore.set(tablesData);

	let foldersDone: number = 0;
	let tagsDone: number = 0;

	for (const tableOverview of tableOverviewsData['data']) {
		// Added general table data
		const table_id = tableOverview['id'];
		// const clone = { ...tableOverview };
		// delete clone.id;
		// tableOverviews[table_id] = { ...clone, folders: {}, tags: {} };

		// Get folders

		(async () => {
			const foldersData = await supabase
				.from('Mod Folders')
				.select('id,name,description')
				.eq('table', table_id);
			if (foldersData['error']) throw foldersData['error'];

			const foldersToAdd: { [key: string]: SingleFolder } = {};
			for (const folder of foldersData['data']) {
				foldersToAdd[folder['id']] = {
					name: folder['name'],
					description: folder['description']
					// mods: {} --> removed for /tableview, on checking whether a table is already loaded or not
				};
			}

			tablesStore.update((table) => {
				Object.assign(table[table_id]['folders'], foldersToAdd);
				return table;
			});
			foldersDone += 1;
		})();

		// for (const folder of foldersData['data']) {
		// 	// tablesStore.update((table) => {
		// 	// 	table[table_id]['folders'][folder['id']] = {

		// 	// 	}
		// 	// })
		// 	tableOverviews[table_id]['folders'][folder['id']] = {
		// 		name: folder['name'],
		// 		description: folder['description']
		// 	};
		// }

		// Get tags

		(async () => {
			const tagsData = await supabase
				.from('Tags')
				.select('id,name,description')
				.eq('table', table_id);
			if (tagsData['error']) throw tagsData['error'];

			const tagsToAdd: { [key: string]: SingleTag } = {};
			for (const tag of tagsData['data']) {
				tagsToAdd[tag['id']] = {
					name: tag['name'],
					description: tag['description']
				};
			}

			tablesStore.update((table) => {
				Object.assign(table[table_id]['tags'], tagsToAdd);
				return table;
			});
			tagsDone += 1;
		})();

		// for (const tag of tagsData['data']) {
		// 	tableOverviews[table_id]['tags'][tag['id']] = {
		// 		name: tag['name'],
		// 		description: tag['description']
		// 	};
		// }
	}

	const l = tableOverviewsData['data'].length;
	while (foldersDone !== l || tagsDone !== l) {
		await new Promise((res) => setTimeout(res, 100));
	}

	alertUser('success', 'Loading complete', 'Successfully loaded general table overviews');

	return;
	// tablesStore.set(tableOverviews);
}

async function loadSingleTable(table_id: string) {
	const folders = get(tablesStore)[table_id]['folders'];

	let foldersDone: number = 0;
	let tagsDone: number = 0;

	for (const folder_id of Object.keys(folders)) {
		(async () => {
			const modsData = await supabase
				.from('Mods')
				.select('id,name,description,additional_info,link,completed,created_at')
				.eq('folder', folder_id);
			if (modsData['error']) throw modsData['error'];
			// folders[folder_id]['mods'] = {};
			const mods: { [key: string]: SingleMod } = {};

			for (const mod of modsData['data']) {
				const clone = { ...mod };
				delete clone.id;
				// folders[folder_id]['mods']![mod['id']] = { ...clone, tags: [] };
				mods[mod['id']] = { ...clone, tags: [] };
			}
			tablesStore.update((table) => {
				table[table_id]['folders'][folder_id]['mods'] = mods;
				return table;
			});

			foldersDone += 1;
		})();
	}

	const foldersLength = Object.keys(folders).length;
	while (foldersDone !== foldersLength) {
		await new Promise((res) => setTimeout(res, 50));
	}

	// Get the tags for each mod
	const tags = Object.keys(get(tablesStore)[table_id]['tags']);
	for (const tag_id of tags) {
		(async () => {
			const tagMods = await supabase.from('Mod Tags').select('mod_id').eq('tag_id', tag_id);
			if (tagMods['error']) throw tagMods['error'];

			// const tags: { [key: string]: SingleTag } = {};
			const modsToAssignTagsTo = tagMods['data'].map(({ mod_id }) => mod_id as string);

			for (const mod_id of modsToAssignTagsTo) {
				for (const folder_id of Object.keys(folders)) {
					if (!folders[folder_id]['mods']) continue;
					if (!folders[folder_id]['mods']![mod_id]) continue;

					// folders[folder_id]['mods']![mod_id]['tags']?.push(tag_id);
					tablesStore.update((table) => {
						table[table_id]['folders'][folder_id]['mods']![mod_id]['tags'].push(tag_id);
						return table;
					});
				}
			}

			tagsDone += 1;

			// Put each tag to the appropriate mods
			// for (const key of tagMods['data']) {
			// 	const modToAssignTagTo = key['mod_id'];
			// 	for (const folder_id of Object.keys(folders)) {
			// 		if (!folders[folder_id]['mods']![modToAssignTagTo]) continue;
			// 		folders[folder_id]['mods']![modToAssignTagTo]['tags']!.push(tag);
			// 	}
			// }
		})();
	}

	// const l = tableOverviewsData['data'].length;
	// const foldersLength = Object.keys(folders).length;
	const tagsLength = tags.length;

	while (tagsDone !== tagsLength) {
		await new Promise((res) => setTimeout(res, 50));
	}

	alertUser(
		'success',
		'Loading complete',
		'Successfully loaded single table: ' + get(tablesStore)[table_id]['name']
	);
}

export { addSingleTable, editSingleTable, deleteSingleTable, loadTableOverviews, loadSingleTable };
