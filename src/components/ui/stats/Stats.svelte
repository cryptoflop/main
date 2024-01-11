<script lang="ts">
	import { getContext, onDestroy } from "svelte";
	import type GameInterface from "../../../game/GameInterface";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import Fps from "./Fps.svelte";

	const gi = getContext<GameInterface>("gameInterface");

	let unsub: () => void;

	function begin(update: () => void) {
		unsub = gi.subscribe(update, [InterfaceEvent.FPS_UPDATE]);
	}

	onDestroy(() => unsub?.());
</script>

<stats>
	<div class="pointer-events-auto fixed top-2 right-2 border border-white/20">
		<Fps name="FPS" on:setup={(e) => begin(e.detail)} />
	</div>
</stats>
