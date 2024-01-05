<script lang="ts">
	import { getContext } from "svelte";

	import type { Object3D } from "three";
	import type { createSceneTreeContext } from "./SceneTreeContext";

	import chevronDown from "../../../../assets/icons/chevron-down.svg?raw";
	import chevronRight from "../../../../assets/icons/chevron-right.svg?raw";

	const selected =
		getContext<ReturnType<typeof createSceneTreeContext>>("sceneTree");

	export let object: Object3D;

	let className = "";
	export { className as class };

	let expanded = true;
</script>

<scene-tree-item class="relative flex flex-col {className}">
	<button class="flex" on:click={() => selected.set(object)}>
		{#if object.children}
			<button on:click|stopPropagation={() => (expanded = !expanded)}>
				<svg class="w-3 h-3 my-auto -ml-0.5 mr-1 mt-px" fill="white">
					{@html expanded ? chevronDown : chevronRight}
				</svg>
			</button>
		{:else}
			<div class="w-3" />
		{/if}
		<div class={$selected === object ? "bg-neutral-600" : ""}>
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
