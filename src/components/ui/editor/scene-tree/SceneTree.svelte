<script lang="ts">
	import SceneTreeItem from "./SceneTreeItem.svelte";
	import { createEventDispatcher } from "svelte";
	import type { TransferableGameObject } from "../../../../game/editor/Editor";

	import plus from "../../../../assets/icons/plus.svg";

	const dispatch = createEventDispatcher<{ create: number | undefined }>();

	export let scene: TransferableGameObject[] | undefined;
	export let selected: TransferableGameObject | undefined;

	function onCreate(parent?: number) {
		dispatch("create", parent);
	}
</script>

<scene-tree
	class="pointer-events-auto fixed top-12 left-2 border border-white/20 pt-1 text-base/4 flex flex-col bg-black"
>
	<div class="flex items-center justify-between px-2">
		<div class="cursor-default">Scene Tree</div>
		<button class="w-[11px] ml-1" on:click={() => onCreate()}>
			<img src={plus} />
		</button>
	</div>
	<div class="flex flex-col overflow-y-auto max-h-[80vh] px-2 pb-1.5">
		{#if scene}
			{#each scene as item}
				<SceneTreeItem object={item} bind:selected oncreate={onCreate} />
			{/each}
		{:else}
			<div class="opacity-50 mx-auto">Empty</div>
		{/if}
	</div>
</scene-tree>
