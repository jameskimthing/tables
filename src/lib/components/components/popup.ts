import { writable, type Writable } from 'svelte/store';

interface PopupInfo {
	title?: string;
	body?: string;
	fields?: { [key: string]: string };
	tagFieldName?: string;
	boolean?: { id: string; description: string; checked: boolean }[];
	chooseFrom?: {
		list: { [key: string]: any };
		choices?: string[];
		description: string;
		choseNotPresent?: Function;
		// multiple?: boolean;
	}[];
	onFieldsSubmit?: Function;
	table_id?: string;
	additionalOption?: {
		name: string;
		onSubmit: Function;
	};
	submitIsDangerous?: boolean;
	nameOfSubmit?: string;
	// If there are fields, there is a submit button

	// exitOnSubmit?: boolean;
	// options?: { [key: string]: Function };
}

const popup: Writable<PopupInfo[]> = writable([]);
function showPopup(i: PopupInfo) {
	popup.update((p) => {
		p.push(i);
		return p;
	});
}

function exitPopup() {
	popup.update((p) => {
		p.pop();
		return p;
	});
}

export { popup, showPopup, exitPopup };
export type { PopupInfo };
