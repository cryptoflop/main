<script lang="ts">
	import { getContext } from "svelte";
	import Stats from "./stats/Stats.svelte";
	import GameInterface from "../../game/GameInterface";
	import Editor from "./editor/Editor.svelte";

	// const gi = getContext<GameInterface>("gameInterface");

	let editor = false;
	DEV: editor = true;
</script>

<ui class="h-screen w-screen absolute flex pointer-events-none">
	<Stats />
	{#if editor}
		<Editor />
	{/if}
</ui>
