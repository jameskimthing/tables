import { showPopup } from '$lib/components/components/popup';
import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import { tablesStore } from './stores';

// async function addSingleFolder(table_id: string, info: { name: string; description: string }) {
async function addSingleFolder(table_id: string) {
	const fields = {
		name: '',
		description: ''
	};

	showPopup({
		title: 'Add a new folder',
		fields: fields,
		onFieldsSubmit: async () => {
			const { data, error } = await supabase
				.from('Mod Folders')
				.insert([{ ...fields, table: table_id }])
				.select();
			console.log(data);
			if (error) throw error;

			tablesStore.update((table) => {
				table[table_id]['folders'][data![0]['id']] = fields;
				return table;
			});
			console.log('Added single table folder');
		}
	});
}

async function editSingleFolder(folder_id: string, table_id: string) {
	console.log('EDITING!');
	console.log(folder_id);

	const folder = get(tablesStore)[table_id]['folders'][folder_id];

	const fields = {
		name: folder['name'],
		description: folder['description']
	};

	showPopup({
		title: `Edit folder: ${folder['name']}`,
		fields: fields,
		onFieldsSubmit: async () => {
			const { data, error } = await supabase.from('Mod Folders').update(fields).eq('id', folder_id);
			if (error) throw error;

			tablesStore.update((table) => {
				const tableFolder = table[table_id]['folders'][folder_id];
				tableFolder['name'] = fields['name'];
				tableFolder['description'] = fields['description'];

				return table;
			});
		}
	});
}

async function deleteSingleFolder(folder_id: string, table_id: string) {
	console.log('DELETING');
	console.log(folder_id);

	const folder = get(tablesStore)[table_id]['folders'][folder_id];

	showPopup({
		title: `Delete folder: ${folder['name']}`,
		submitIsDangerous: true,
		onFieldsSubmit: async () => {
			const mods: string[] = Object.keys(folder['mods'] ?? {});
			let deleted_count: number = 0;
			for (const mod of mods) {
				(async () => {
					await supabase.from('Mods').delete().eq('id', mod);
					deleted_count += 1;
				})();
			}

			tablesStore.update((table) => {
				delete table[table_id]['folders'][folder_id];
				return table;
			});

			while (deleted_count !== mods.length) {
				await new Promise((res) => setTimeout(res, 100));
			}
			await supabase.from('Mod Folders').delete().eq('id', folder_id);
		}
	});
}

export { addSingleFolder, editSingleFolder, deleteSingleFolder };
