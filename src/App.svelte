<script lang="ts">
	import { setContext } from "svelte";
	import Game from "./Game.svelte";
	import GameInterface from "./game/GameInterface";
	import Ui from "./components/ui/UI.svelte";

	const gameInterface = new GameInterface();
	setContext("gameInterface", gameInterface);

	let gameSetup = false;
</script>

<main class="h-screen w-screen">
	<Game {gameInterface} on:setup={() => (gameSetup = true)} />

	{#if gameSetup}
		<Ui />
	{/if}
</main>
