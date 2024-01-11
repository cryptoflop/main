<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const KEYS = ["X", "Y", "Z", "W"];

	const dispatch = createEventDispatcher();

	let vector: (number | string)[];
	export { vector as value };

	function onChange(i: number, num: number) {
		const vec = [...vector];
		vec[i] = num;
		dispatch("change", vec);
	}

	function enterValueSlider(i: number) {
		let shift = false;
		const onKeyDown = (e: KeyboardEvent) => (shift = e.key === "Shift");
		const onKeyUp = (e: KeyboardEvent) => {
			if (shift && e.key === "Shift") shift = false;
		};
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);

		const onMove = (e: MouseEvent) => {
			onChange(i, (vector[i] as number) + e.movementX / (shift ? 100 : 10));
		};
		document.addEventListener("mousemove", onMove);
		document.body.addEventListener(
			"mouseup",
			() => {
				document.removeEventListener("mousemove", onMove);
				document.removeEventListener("keydown", onKeyDown);
				document.removeEventListener("keyup", onKeyUp);
				document.exitPointerLock();
			},
			{ once: true },
		);
		document.body.requestPointerLock();
	}

	function onInputChange(i: number, e: Event) {
		const num = Number((e.target! as HTMLInputElement).value) || 0;
		onChange(i, num);
	}
</script>

<vector-editor class="flex gap-1">
	{#each vector as v, i}
		<float class="relative flex">
			<button
				class="text-lg/3 px-[3px] bg-black border border-r-0 cursor-e-resize"
				on:mousedown={() => enterValueSlider(i)}
			>
				{KEYS[i]}
			</button>
			<input
				type="number"
				value={v}
				on:change={(e) => onInputChange(i, e)}
				class="w-[38px] h-4 px-1 py-0.5"
			/>
		</float>
	{/each}
</vector-editor>
