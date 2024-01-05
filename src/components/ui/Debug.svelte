<script lang="ts">
	import { getContext, onDestroy, onMount } from "svelte";
	import type GameInterface from "../../game/GameInterface";

	import Stats from "three/addons/libs/stats.module.js";
	import { GUI } from "three/addons/libs/lil-gui.module.min.js";
	import { GameEvents } from "../../game/types/events/Game";
	import { InterfaceEvent } from "../../game/types/events/Inteface";

	let statsContainer: HTMLDivElement;
	let guiContainer: HTMLDivElement;

	const stats = new Stats();

	const gi = getContext<GameInterface>("gameInterface");

	onMount(() => {
		statsContainer!.appendChild(stats.dom);

		return gi.subscribe(
			() => stats.update(),
			[GameEvents.BEFORE_RENDER_UPDATE],
		);
	});

	onMount(() => {
		const controls = {
			toggleMode: () =>
				gi.gameWorker.postMessage({ ev: InterfaceEvent.EDITOR_TOGGLE }),
		};
		const gui = new GUI({
			container: guiContainer!,
			title: "Controls",
			width: 120,
		});
		gui.add(controls, "toggleMode").name("Toggle Mode");
	});
</script>

<stats>
	<div class="pointer-events-auto" bind:this={statsContainer} />
	<div class="pointer-events-auto fixed top-0 left-20" bind:this={guiContainer} />
</stats>
