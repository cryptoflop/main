<script lang="ts">
	import { getContext, onMount } from "svelte";
	import type GameInterface from "../../../game/GameInterface";
	import SceneTree from "./scene-tree/SceneTree.svelte";
	import type { SceneTreeObj } from "../../../game/editor/Editor";
	import Inspector from "./inspector/Inspector.svelte";
	import { GameEvents } from "../../../game/types/events/Game";

	import play from "../../../assets/icons/play.svg";
	import stop from "../../../assets/icons/stop.svg";
	import cross from "../../../assets/icons/game.svg";
	import cube from "../../../assets/icons/cube.svg";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";

	const gi = getContext<GameInterface>("gameInterface");

	let selected: SceneTreeObj | undefined;

	let gameRunning = false;
	let editMode = false;

	DEV: {
		onMount(() => {
			gi.gameWorker.postMessage({ ev: InterfaceEvent.EDITOR_TOGGLE });

			const uet = gi.subscribe(
				() => (editMode = !editMode),
				[InterfaceEvent.EDITOR_TOGGLE],
			);
			const ugr = gi.subscribe(
				(_, ev) => (gameRunning = ev == GameEvents.START),
				[GameEvents.START, GameEvents.STOP],
			);
			return () => {
				uet();
				ugr();
			};
		});
	}
</script>

<editor class="finders-keepers text-xl">
	<controls
		class="pointer-events-auto fixed top-2 left-2 border border-white/20 flex divide-x divide-white/20"
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
		<SceneTree />
		{#if selected}
			<Inspector object={selected} />
		{/if}
	{/if}
</editor>
