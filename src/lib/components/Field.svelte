<script lang="ts">
	import { onMount } from 'svelte';

	export let is: string;
	export let info: any;

	const isPassword = is === 'password';
	const type: string = isPassword ? is : 'text';
	const placeholder: string = is.charAt(0).toUpperCase() + is.slice(1);

	let input: HTMLInputElement;
	onMount(() => (input = document.getElementById(is) as HTMLInputElement));

	const handleInput = (e: any) => {
		info[is] = e.target.value;
	};
</script>

<div class="flex flex-row justify-between min-w-fit w-80 pt-1 pr-1 relative">
	{placeholder + ': '}
	<input
		id={is}
		{type}
		{placeholder}
		on:input={handleInput}
		class="rounded pl-1 focus:outline-none"
		required
	/>
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
