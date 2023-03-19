<script lang="ts">
	type iconTypes = 'delete' | 'edit' | 'private';
	export let type: iconTypes;

	const icons: { [key in iconTypes]: string } = {
		delete: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m10 12v5" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="m14 12v5" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="m4 7h16" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="m6 10v8c0 1.6569 1.3432 3 3 3h6c1.6569 0 3-1.3431 3-3v-8" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="m9 5c0-1.1046 0.89543-2 2-2h2c1.1046 0 2 0.89543 2 2v2h-6v-2z" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>`,
		edit: `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
		private: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.1819 10.703h-2.1818c-0.55227 0-0.99998 0.4458-0.99999 0.9981-4e-5 1.6475-9e-5 4.9764 2e-5 7.2181 1.2e-4 2.5128 3.8861 3.0811 6.9999 3.0811 3.1139 0 7-0.5683 7-3.0811v-7.2181c0-0.5523-0.4477-0.9981-1-0.9981h-2.1818m-7.6363 0s3e-5 -2.5676 0-4.1081c-4e-5 -1.8489 1.527-3.5946 3.8181-3.5946 2.2912 0 3.8182 1.7457 3.8182 3.5946v4.1081m-7.6363 0h7.6363" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="m13 16.618v1.3819c0 0.5523-0.4477 1-1 1s-1-0.4477-1-1v-1.3819c-0.3069-0.2747-0.5-0.6739-0.5-1.1181 0-0.8284 0.6716-1.5 1.5-1.5s1.5 0.6716 1.5 1.5c0 0.4442-0.1931 0.8434-0.5 1.1181z" clip-rule="evenodd" fill="#000" fill-rule="evenodd" /></svg>`
	};
</script>

<div class="cursor-pointer border-2 rounded border-transparent hover:border-black">
	{@html icons[type]}
</div>
