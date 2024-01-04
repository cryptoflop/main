<script lang="ts">
	import.meta.hot?.invalidate();

	import { getContext } from "svelte";
	import type GameInterface from "../../game/GameInterface";

	import Stats from "three/addons/libs/stats.module.js";
	import { GUI } from "three/addons/libs/lil-gui.module.min.js";

	const stats = new Stats();
	document.body.appendChild(stats.dom);

	const gui = new GUI();
	gui.add({ value: 0 }, "value", -0.0098, 0, 0.0001).name("gravity");
	gui.add({ value: 0 }, "value", 0.1, 1, 0.01).name("bounce");

	const gi = getContext<GameInterface>("gameInterface");

	gi.subscribe("beforeRenderUpdate", (delta: number) => {
		stats.update();
	});
</script>
