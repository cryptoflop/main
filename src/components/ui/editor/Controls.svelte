<script lang="ts">
	import { getContext } from "svelte";
	import Selector from "./Selector.svelte";
	import { GameEvent } from "../../../game/types/events/Game";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import type createEditorContext from "./EditorCtx";

	import play from "../../../assets/icons/play.svg";
	import stop from "../../../assets/icons/stop.svg";
	import cross from "../../../assets/icons/game.svg";
	import cube from "../../../assets/icons/cube.svg";

	const ctx = getContext<ReturnType<typeof createEditorContext>>("editor");
	let { editMode, running } = ctx;
</script>

<controls class="pointer-events-auto fixed top-2 left-2 flex gap-1 bg-black">
	<button
		class="text-base/4 flex items-center pr-0.5 border"
		on:click={() => {
			self.post($running ? GameEvent.STOP : GameEvent.START);
			$running = !$running;
		}}
	>
		<img src={$running ? stop : play} class="w-3 h-3 mx-0.5" />
		{$running ? "Stop" : "Play"}
	</button>
	<button
		class="text-base/4 flex items-center pr-0.5 border"
		on:click={() => {
			self.post(InterfaceEvent.EDITOR_TOGGLE);
			$editMode = !$editMode;
		}}
	>
		<img src={$editMode ? cross : cube} class="w-3 h-3 mx-1" />
		{$editMode ? "Game" : "Edit"}
	</button>

	<Selector />
</controls>
