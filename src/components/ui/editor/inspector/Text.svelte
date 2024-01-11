<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let label: string;
	export let value: string | undefined;

	const dispatch = createEventDispatcher();

	function onInputChange(e: Event) {
		const text = (e.target! as HTMLInputElement).value || "";
		dispatch("change", text);
	}
</script>

<text-editor class="flex">
	<label class="text-lg/3 border border-r-0 h-4 pl-0.5 pr-px">{label}</label>
	<input
		{value}
		type="text"
		class="text-base/3 px-1 pr-0.5 h-4"
		on:change={onInputChange}
	/>
</text-editor>
