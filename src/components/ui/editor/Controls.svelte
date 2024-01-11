<script lang="ts">
	import { getContext, onMount } from "svelte";
	import { GameEvent } from "../../../game/types/events/Game";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import type GameInterface from "../../../game/GameInterface";

	import play from "../../../assets/icons/play.svg";
	import stop from "../../../assets/icons/stop.svg";
	import cross from "../../../assets/icons/game.svg";
	import cube from "../../../assets/icons/cube.svg";

	const gi = getContext<GameInterface>("gameInterface");

	let gameRunning = true;
	let editMode = false;

	onMount(() => {
		return gi.subscribe(
			(_param, ev) => {
				switch (ev) {
					case InterfaceEvent.EDITOR_TOGGLE:
						editMode = !editMode;
						break;
					case GameEvent.START:
					case GameEvent.STOP:
						gameRunning = ev == GameEvent.START;
						break;
				}
			},
			[InterfaceEvent.EDITOR_TOGGLE, GameEvent.START, GameEvent.STOP],
		);
	});
</script>

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
		on:click={() => self.post(InterfaceEvent.EDITOR_TOGGLE)}
	>
		<img src={editMode ? cross : cube} class="w-3 h-3 mx-1" />
		{editMode ? "Game" : "Edit"}
	</button>
</controls>
