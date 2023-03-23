<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import Popup from '$lib/components/form/Popup.svelte';
	import '../app.css';

	// showPopup({
	// 	title: 'Hello, There!',
	// 	body: 'This is a popup to describe stuff!',
	// 	fields: {
	// 		name: 'Hello',
	// 		description: ''
	// 	},
	// 	boolean: [
	// 		{
	// 			id: 'public_id',
	// 			description: 'Is the public?',
	// 			checked: true
	// 		}
	// 	],
	// 	onFieldsSubmit: () => console.log('Form SUBMIT'),
	// 	chooseFrom: [
	// 		{
	// 			// list: $tablesStore['11']['tags'],
	// 			list: {
	// 				'1': {
	// 					name: 'NAME'
	// 				},
	// 				'2': {
	// 					name: 'NOT NAME'
	// 				}
	// 			},
	// 			description: 'Tags'
	// 		}
	// 	]

	// exitOnSubmit: false
	// options:
	// });
</script>

<div class="">
	<slot />
</div>

<Popup />
<Alert />
