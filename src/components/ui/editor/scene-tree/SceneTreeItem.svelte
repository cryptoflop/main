<script lang="ts">
	import { getContext } from "svelte";

	import type { createSceneTreeContext } from "./SceneTreeContext";

	import dash from "../../../../assets/icons/dash.svg";
	import chevronDown from "../../../../assets/icons/chevron-down.svg";
	import chevronRight from "../../../../assets/icons/chevron-right.svg";
	import type { SceneTreeObj } from "../../../../game/editor/Editor";

	const { selected, action } =
		getContext<ReturnType<typeof createSceneTreeContext>>("sceneTree");

	export let object: SceneTreeObj;

	let className = "";
	export { className as class };

	let expanded = true;
</script>

<scene-tree-item class="relative flex flex-col {className}">
	<button
		class="flex"
		on:click={() => selected.set(object)}
		on:contextmenu={() => action.set(object)}
	>
		{#if object.children}
			<button on:click|stopPropagation={() => (expanded = !expanded)}>
				<img
					src={expanded ? chevronDown : chevronRight}
					class="w-3 h-3 my-auto -ml-0.5 mr-1 mt-px"
				/>
			</button>
		{:else}
			<img src={dash} class="w-3 h-3 my-auto -ml-0.5 mr-1 mt-px" />
		{/if}
		<div class={$selected === object ? "bg-white/20" : ""}>
			<span>{object.name ?? "Object"}</span>
			<span>[{object.type}]</span>
		</div>
	</button>
	{#if expanded && object.children}
		{#each object.children as child}
			<svelte:self object={child} class="pl-2 pt-0.5" />
		{/each}
		<div class="absolute w-px top-4 bottom-1 ml-1 bg-neutral-700" />
	{/if}
</scene-tree-item>
