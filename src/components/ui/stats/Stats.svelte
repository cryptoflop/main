<script lang="ts">
	import { getContext, onDestroy } from "svelte";
	import type GameInterface from "../../../game/GameInterface";
	import { GameEvents } from "../../../game/types/events/Game";
	import Fps from "./Fps.svelte";

	const gi = getContext<GameInterface>("gameInterface");

	let unsub: () => void;

	function begin(update: () => void) {
		unsub = gi.subscribe(update, [GameEvents.BEFORE_RENDER_UPDATE]);
	}

	onDestroy(() => unsub?.());
</script>

<stats>
	<div class="pointer-events-auto fixed top-2 right-2 border border-white/20">
		<Fps name="FPS" on:setup={(e) => begin(e.detail)} />
	</div>
</stats>
