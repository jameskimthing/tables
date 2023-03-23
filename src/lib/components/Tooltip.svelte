<script lang="ts">
	export let is: string;
	export let direction: 'right' | 'left' = 'right';

	const t = direction === 'left' ? '-translate-x-3/4' : '';
</script>

{#if is}
	<div class="transition-all scale-y-0 group-hover:scale-y-100">
		<div class={`absolute top-2 shadow-xl bg-black rounded-md py-1 px-2 ${t}`}>
			<div class="w-auto min-w-max text-white font-bold text-sm relative">{is}</div>
		</div>
	</div>
{/if}
