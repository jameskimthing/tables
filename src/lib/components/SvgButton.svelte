<script lang="ts">
	import { icons, type iconTypes } from './components/icons';
	import Tooltip from './Tooltip.svelte';

	export let type: iconTypes;
	export let is: string;
	export let click: any = null;
	export let direction: 'left' | 'right' = 'right';
	export let scale: number = 1;
</script>

<div class="group">
	{#if click}
		<div
			class="cursor-pointer border-2 rounded border-transparent hover:border-black hover:bg-gray-300"
			style={`transform: scale(${scale});`}
			on:pointerup={click}
		>
			{@html icons[type]}
		</div>
		<Tooltip {is} {direction} />
	{:else}
		<div class="hover:bg-gray-300 rounded" style={`transform: scale(${scale});`}>
			{@html icons[type]}
		</div>
		<Tooltip {is} {direction} />
	{/if}
</div>
