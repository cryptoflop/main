<script lang="ts">
	import { getContext, onMount } from "svelte";
	import type GameInterface from "../../../game/GameInterface";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import SceneTree from "./scene-tree/SceneTree.svelte";
	import type { Object3D } from "three";

	const gi = getContext<GameInterface>("gameInterface");

	let sceneTree: Object3D;

	DEV: {
		onMount(() => {
			return gi.subscribe(
				(scene: Object3D) => {
					sceneTree = scene;
				},
				[InterfaceEvent.EDITOR_SCENE_UPDATE],
			);
		});
	}
</script>

<editor class="font-sans">
	<SceneTree {sceneTree} on:select={e => console.log(e.detail)} />
</editor>
