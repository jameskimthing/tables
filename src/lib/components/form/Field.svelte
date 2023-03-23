<script lang="ts">
	import { onMount } from 'svelte';

	export let is: string;
	export let info: { [key: string]: any };
	export let autofocus: boolean = false;

	export let isTag: boolean = false;

	const isPassword = is === 'password';
	const type: string = isPassword ? is : 'text';
	const placeholder: string = is.charAt(0).toUpperCase() + is.slice(1);

	let input: HTMLInputElement;
	onMount(() => (input = document.getElementById(is) as HTMLInputElement));

	let previewText: string = info[is].toLowerCase().replaceAll(' ', '-');
	const handleInput = (e: any) => {
		info[is] = e.target.value;

		previewText = info[is].toLowerCase().replaceAll(' ', '-');
	};

	console.log(info[is]);

	function setPreview() {
		isFocus = false;
		if (!isTag) return;
		info[is] = previewText;
	}

	async function onKeydown(e: any) {
		if (!isTag) return;
		e = e || window.event;

		if (e.keyCode == '13') {
			// Enter!
			e.preventDefault();
			info[is] = previewText;
		}
	}

	let isFocus: boolean = false;
</script>

<div class="flex flex-row justify-between pt-1 pr-1 relative">
	{placeholder + ': '}
	<div>
		{#if isTag && previewText !== '' && isFocus}
			<div class="z-10 border-2 border-black bg-white px-2 rounded shadow absolute -mt-8">
				{previewText}
			</div>
		{/if}
		<input
			id={is}
			{type}
			{placeholder}
			{autofocus}
			on:input={handleInput}
			on:keydown={onKeydown}
			on:blur={setPreview}
			on:focus={() => (isFocus = true)}
			value={info[is] ?? ''}
			class="rounded pl-1 focus:outline-none"
			required
		/>
	</div>
	{#if isPassword}
		<div
			class="absolute left-full cursor-pointer"
			on:pointerdown={() => (isPassword ? (input.type = 'text') : '')}
			on:pointerup={() => (isPassword ? (input.type = 'password') : '')}
		>
			(i)
		</div>
	{/if}
</div>
