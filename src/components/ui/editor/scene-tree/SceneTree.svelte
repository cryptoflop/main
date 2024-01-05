<script lang="ts">
	import { Object3D } from "three";
	import SceneTreeItem from "./SceneTreeItem.svelte";
	import { createSceneTreeContext } from "./SceneTreeContext";
	import { createEventDispatcher, setContext } from "svelte";

	export let sceneTree: Object3D;

	const dispatch = createEventDispatcher();

	const ctx = createSceneTreeContext();
	setContext("sceneTree", ctx);

	let selected: Object3D | undefined;
	ctx.subscribe((o) => {
		if (selected === o) return;
		selected = o;
		dispatch("select", o);
	});
</script>

<scene-tree
	class="pointer-events-auto fixed top-20 border px-2 pb-1.5 pt-1 text-xs"
>
	{#if sceneTree}
		<SceneTreeItem object={sceneTree} />
	{/if}
</scene-tree>
