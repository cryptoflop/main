<script lang="ts">
	import SceneTreeItem from "./SceneTreeItem.svelte";
	import { createSceneTreeContext } from "./SceneTreeContext";
	import { getContext, onMount, setContext } from "svelte";
	import type { SceneTreeObj } from "../../../../game/editor/Editor";
	import { InterfaceEvent } from "../../../../game/types/events/Inteface";
	import type GameInterface from "../../../../game/GameInterface";

	const gi = getContext<GameInterface>("gameInterface");

	const ctx = createSceneTreeContext();
	setContext("sceneTree", ctx);

	let sceneTree: SceneTreeObj;

	onMount(() => {
		return gi.subscribe(
			(param: { parent?: string; tree: SceneTreeObj }) => {
				if (param.parent === undefined) {
					sceneTree = param.tree;
				}
			},
			[InterfaceEvent.EDITOR_SCENE_UPDATE],
		);
	});

	function createObject(obj?: SceneTreeObj) {
		const name = prompt("Name");
		if (!name) return;
		gi.gameWorker.postMessage({
			ev: InterfaceEvent.EDITOR_OBJECT_CREATE,
			param: { id: obj?.id, name },
		});
	}

	onMount(() => {
		let selected: SceneTreeObj | undefined;

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
	<div>Scene Tree</div>
	{#if sceneTree}
		<SceneTreeItem object={sceneTree} />
	{:else}
		<div class="opacity-50 mx-auto" on:click={(e) => createObject()}>Empty</div>
	{/if}
</scene-tree>
