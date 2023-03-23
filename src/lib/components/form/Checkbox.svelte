<script lang="ts">
	const icon = `<svg fill="#ffffff" data-name="Layer 1" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg"><title>check</title><path d="M61.07,12.9,57,8.84a2.93,2.93,0,0,0-4.21,0L28.91,32.73,19.2,23A3,3,0,0,0,15,23l-4.06,4.07a2.93,2.93,0,0,0,0,4.21L26.81,47.16a2.84,2.84,0,0,0,2.1.89A2.87,2.87,0,0,0,31,47.16l30.05-30a2.93,2.93,0,0,0,0-4.21Z"/></svg>`;

	// Use as a form field
	// export let is: string = '';
	// export let info: any = null;
	// export let info: { checked: boolean } = { checked: false };
	export let info: { checked: boolean };

	// Use as a standalone checkbox
	export let onClick: Function = () => {};
	export let onUnclick: Function = () => {};

	let checked: boolean;
	$: checked = info ? info['checked'] : false;

	async function click() {
		if (info) info['checked'] = !info['checked'];
		else {
			if (checked) {
				checked = false;
				await onClick();
			} else {
				checked = true;
				await onUnclick();
			}
		}
	}
</script>

<div class="cursor-pointer select-none" on:pointerup={click}>
	{#if checked}
		<div class="w-5 h-5 rounded border-2 border-slate-800 bg-slate-800">
			<div class="mt-0.5">
				{@html icon}
			</div>
		</div>
	{:else}
		<div class="w-5 h-5 rounded border-2 border-slate-900 bg-slate-200" />
	{/if}
</div>
