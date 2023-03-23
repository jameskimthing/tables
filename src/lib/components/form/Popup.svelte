<script lang="ts">
	import type { SingleTag } from '$lib/tables/stores';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import Checkbox from './Checkbox.svelte';
	import { exitPopup, popup } from '../components/popup';
	import Field from './Field.svelte';
	import TagChoices from './TagChoices.svelte';

	// async function submit() {
	// 	// await new Promise((res) => setTimeout(res, 1000));
	// 	if ($popup['onFieldsSubmit']) await $popup['onFieldsSubmit']();
	// 	exitPopup();
	// }

	// let info: { [key: string]: string | boolean } = {};
	// $: () => {
	// 	if ($popup['fields']) info = $popup['fields'];
	// 	console.log('FIELDS!');
	// 	console.log($popup['fields']);
	// };

	// let tagInput: string;
	// let chosenTags: { [key: string]: SingleTag } = {};
	// $: console.log(tagInput);

	// const table_id = $popup['table_id'];
	// console.log('THE TABLE ID!');
	// console.log(table_id);
	// $: chosenTags = table_id ? filterThroughTags(tagInput, table_id!) : {};

	// let count: number = 0
	let isFirstField: boolean = true;
	function checkIfFirstField() {
		if (isFirstField) {
			isFirstField = false;
			return true;
		}
		return false;
	}

	function resetFirst() {
		isFirstField = true;
		return '';
	}
</script>

{#each $popup as pop}
	{#if Object.keys($popup).length !== 0}
		<div class="fixed left-0 right-0 top-0 bottom-0 backdrop-blur-sm z-20" />
		<div
			class="fixed left-1/2 top-1/3 z-20 bg-slate-100 rounded-xl shadow-2xl"
			style="transform: translate(-50%,-50%);"
		>
			<div class="flex flex-col">
				<div class="bg-slate-700 text-white rounded-t-xl text-center py-2 px-24 text-2xl">
					{pop['title'] ?? ''}
				</div>
				<div class="italic text-gray-600 pt-1 text-center">
					{pop['body'] ?? ''}
				</div>
				<div class="px-4 pt-2 pb-4">
					<form>
						{#if pop['fields']}
							{resetFirst()}
							{#each Object.entries(pop['fields']) as [field_name, default_value]}
								{#if pop['tagFieldName'] === field_name}
									<Field
										is={field_name}
										info={pop['fields']}
										autofocus={checkIfFirstField()}
										isTag={true}
									/>
								{:else}
									<Field is={field_name} info={pop['fields']} autofocus={checkIfFirstField()} />
								{/if}
							{/each}
						{/if}
						{#if pop['chooseFrom'] && pop['table_id']}
							{#each pop['chooseFrom'] as choiceField}
								<div class="py-2">
									<TagChoices table_id={pop['table_id']} {choiceField} />
								</div>
							{/each}
						{/if}

						{#if pop['boolean']}
							{#each pop['boolean'] as bool}
								<div class="flex flex-row items-center py-2">
									<Checkbox info={bool} />
									<div class="pl-2 ">
										{bool['description']}
									</div>
								</div>
							{/each}
						{/if}

						<div class="w-full pt-4">
							<!-- <div class="w-fit ml-auto"> -->
							<div class="w-full flex flex-row justify-between">
								<div>
									{#if pop['additionalOption']}
										<Button
											submit={pop['additionalOption']['onSubmit']}
											name={pop['additionalOption']['name']}
											dontSubmit={true}
											isDangerous={true}
										/>
									{/if}
								</div>
								<div>
									<Button
										darkTheme={true}
										submit={async () => {
											if (pop['onFieldsSubmit']) await pop['onFieldsSubmit']();
											exitPopup();
										}}
										name={pop['nameOfSubmit'] ?? 'submit'}
										isDangerous={pop['submitIsDangerous']}
									/>
									<Button dontSubmit={true} name="cancel" submit={exitPopup} />
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
{/each}
