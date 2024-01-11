<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	export let name: string;

	let canvas: HTMLCanvasElement;

	let min = Infinity;
	let max = 0;
	const round = Math.round;
	const PR = round(window.devicePixelRatio || 1);

	const WIDTH = 82 * PR,
		HEIGHT = 33 * PR,
		TEXT_X = 4 * PR,
		TEXT_Y = 0 * PR,
		GRAPH_X = 0 * PR,
		GRAPH_Y = 15 * PR,
		GRAPH_WIDTH = WIDTH * PR,
		GRAPH_HEIGHT = 18 * PR;

	const bg = "#000000",
		fg = "#f6f6f6";

	const dispatch = createEventDispatcher();

	onMount(() => {
		const context = canvas!.getContext("2d")!;
		context.font = "bold " + 15 * PR + "px FindersKeepers,mono";
		context.textBaseline = "top";

		context.fillStyle = fg;
		context.fillText(name, TEXT_X, TEXT_Y);
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		context.fillStyle = bg;
		context.globalAlpha = 0.9;
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		const drawUpdate = (value: number, maxValue: number) => {
			min = Math.min(min, value);
			max = Math.max(max, value);

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect(0, 0, WIDTH, GRAPH_Y);
			context.fillStyle = fg;
			context.fillText(
				round(value) + " " + name + " (" + round(min) + "-" + round(max) + ")",
				TEXT_X,
				TEXT_Y,
			);

			context.drawImage(
				canvas,
				GRAPH_X + PR,
				GRAPH_Y,
				GRAPH_WIDTH - PR,
				GRAPH_HEIGHT,
				GRAPH_X,
				GRAPH_Y,
				GRAPH_WIDTH - PR,
				GRAPH_HEIGHT,
			);

			context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect(
				GRAPH_X + GRAPH_WIDTH - PR,
				GRAPH_Y,
				PR,
				round((1 - value / maxValue) * GRAPH_HEIGHT),
			);
		};

		const update = (fps: number) => {
			drawUpdate(fps, 200);
		};

		drawUpdate(0, 1);
		dispatch("setup", update);
	});
</script>

<canvas bind:this={canvas} width={WIDTH} height={HEIGHT} />
