<script lang="ts">
	import { getContext, onMount } from "svelte";
	import type GameInterface from "../../../game/GameInterface";
	import SceneTree from "./scene-tree/SceneTree.svelte";
	import Inspector from "./inspector/Inspector.svelte";
	import { GameEvent } from "../../../game/types/events/Game";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import type { TransferableGameObject } from "../../../game/editor/Editor";

	import play from "../../../assets/icons/play.svg";
	import stop from "../../../assets/icons/stop.svg";
	import cross from "../../../assets/icons/game.svg";
	import cube from "../../../assets/icons/cube.svg";

	const gi = getContext<GameInterface>("gameInterface");

	let scene: TransferableGameObject = {
		children: [],
	} as unknown as TransferableGameObject;
	let selected: TransferableGameObject | undefined;

	let gameRunning = false;
	let editMode = false;

	DEV: {
		onMount(() => {
			gi.gameWorker.postMessage({ ev: InterfaceEvent.EDITOR_TOGGLE });

			function replaceObj(
				obj: TransferableGameObject,
				on: TransferableGameObject,
			) {
				for (let i = 0; i < on.children!.length; i++) {
					const child = on.children![i];
					if (child.id === obj.id) {
						on.children!.splice(i, 1, obj);
						return true;
					} else {
						if (child.children) {
							if (replaceObj(obj, child)) {
								return true;
							}
						}
					}
				}
				return false;
			}

			return gi.subscribe(
				(param, ev) => {
					switch (ev) {
						case InterfaceEvent.EDITOR_TOGGLE:
							editMode = !editMode;
							break;
						case InterfaceEvent.EDITOR_SCENE_UPDATE:
							if ((param as TransferableGameObject)?.id) {
								replaceObj(param as TransferableGameObject, scene);
								scene = { ...scene };
							} else {
								scene.children = param as TransferableGameObject[];
							}
							break;
						case GameEvent.START:
						case GameEvent.STOP:
							gameRunning = ev == GameEvent.START;
							break;
					}
				},
				[
					InterfaceEvent.EDITOR_TOGGLE,
					InterfaceEvent.EDITOR_SCENE_UPDATE,
					GameEvent.START,
					GameEvent.STOP,
				],
			);
		});
	}
</script>

<editor class="finders-keepers text-xl">
	<controls
		class="pointer-events-auto fixed top-2 left-2 border border-white/20 flex divide-x divide-white/20 bg-black"
	>
		<button
			class="text-base/4 flex items-center pr-0.5"
			on:click={() => (gameRunning = !gameRunning)}
		>
			<img src={gameRunning ? stop : play} class="w-3 h-3 mx-0.5" />
			{gameRunning ? "Stop" : "Play"}
		</button>
		<button
			class="text-base/4 flex items-center pr-0.5"
			on:click={() =>
				gi.gameWorker.postMessage({ ev: InterfaceEvent.EDITOR_TOGGLE })}
		>
			<img src={editMode ? cross : cube} class="w-3 h-3 mx-1" />
			{editMode ? "Game" : "Edit"}
		</button>
	</controls>

	{#if editMode}
		<SceneTree scene={scene.children} />
		{#if selected}
			<Inspector object={selected} />
		{/if}
	{/if}
</editor>
