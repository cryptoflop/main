<script lang="ts">
	import.meta.hot?.invalidate();

	import { setContext } from "svelte";
	import Game from "./Game.svelte";
	import GameInterface from "./game/GameInterface";
	import Ui from "./components/ui/UI.svelte";

	const gameInterface = new GameInterface();
	setContext("gameInterface", gameInterface);
</script>

<main class="h-screen w-screen">
	<Game {gameInterface} />

	<Ui />
</main>
