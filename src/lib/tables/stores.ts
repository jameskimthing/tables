import { writable, type Writable } from 'svelte/store';

interface SingleTag {
	// id: string;
	name: string;
	description: string;
}

interface SingleMod {
	// folder: string;
	// id: string;
	name: string;
	description: string;
	additional_info: string;
	link: string;
	completed: boolean;
	created_at: Date;
	// tags?: string[];
	tags: string[];
}

interface SingleFolder {
	// id: string;
	// table: string;
	name: string;
	description: string;
	mods?: { [key: string]: SingleMod };
}

interface SingleTable {
	// id: string;
	// tags: SingleTag[];
	name: string;
	description: string;

	folders: { [key: string]: SingleFolder };
	tags: { [key: string]: SingleTag };

	is_public: boolean;
	made_by: string;
}

const tablesStore: Writable<{ [key: string]: SingleTable }> = writable({});

export { tablesStore };
export type { SingleTag, SingleMod, SingleFolder, SingleTable };
