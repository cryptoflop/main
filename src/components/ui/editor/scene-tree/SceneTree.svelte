<script lang="ts">
	import SceneTreeItem from "./SceneTreeItem.svelte";
	import { createSceneTreeContext } from "./SceneTreeContext";
	import { getContext, onMount, setContext } from "svelte";
	import { InterfaceEvent } from "../../../../game/types/events/Inteface";
	import type GameInterface from "../../../../game/GameInterface";
	import type { TransferableGameObject } from "../../../../game/editor/Editor";

	import plus from "../../../../assets/icons/plus.svg";

	const gi = getContext<GameInterface>("gameInterface");

	const ctx = createSceneTreeContext();
	setContext("sceneTree", ctx);

	export let scene: TransferableGameObject[] | undefined;

	function createObject(obj?: TransferableGameObject) {
		const name = prompt("Name");
		if (!name) return;
		gi.gameWorker.postMessage({
			ev: InterfaceEvent.EDITOR_OBJECT_CREATE,
			param: { id: obj?.id, name },
		});
	}

	onMount(() => {
		let selected: TransferableGameObject | undefined;

		ctx.selected.subscribe((o) => {
			if (selected === o) {
				selected = undefined;
				ctx.selected.set(undefined);
			} else {
				selected = o;
			}
		});

		let init = true;
		ctx.action.subscribe((o) => {
			if (init) {
				init = false;
				return;
			}
			createObject(o);
		});
	});
</script>

<scene-tree
	class="pointer-events-auto fixed top-12 left-2 border border-white/20 px-2 pb-1.5 pt-1 text-base/4 flex flex-col"
>
	<div class="flex items-center justify-between">
		<div class="cursor-default">Scene Tree</div>
		<button class="w-[11px] ml-1" on:click={() => createObject()}>
			<img src={plus} />
		</button>
	</div>
	{#if scene}
		{#each scene as item}
			<SceneTreeItem object={item} />
		{/each}
	{:else}
		<div class="opacity-50 mx-auto">Empty</div>
	{/if}
</scene-tree>
