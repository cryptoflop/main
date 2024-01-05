<script lang="ts">
	import { getContext, onMount } from "svelte";
	import Debug from "./Debug.svelte";
	import GameInterface from "../../game/GameInterface";
	import { InterfaceEvent } from "../../game/types/events/Inteface";
	import Editor from "./editor/Editor.svelte";

	const gi = getContext<GameInterface>("gameInterface");

	let editor = false;

	DEV: {
		onMount(() => {
			return gi.subscribe(
				(active: boolean) => (editor = active),
				[InterfaceEvent.EDITOR_TOGGLE],
			);
		});
	}
</script>

<ui class="h-screen w-screen absolute flex pointer-events-none">
	<Debug />
	{#if editor}
		<Editor />
	{/if}
</ui>
