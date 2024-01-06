<script lang="ts">
	import type { SceneTreeObj } from "../../../../game/editor/Editor";
	import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
	import { getContext } from "svelte";
	import GameInterface from "../../../../game/GameInterface";
	import { InterfaceEvent } from "../../../../game/types/events/Inteface";

	let container: HTMLDivElement;

	const gi = getContext<GameInterface>("gameInterface");

	export let object: SceneTreeObj;

	let gui: GUI;
	$: {
		if (gui) {
			gui.destroy();
		}

		gui = new GUI({
			container: container!,
			title: "Inspector",
			width: 200,
		});

		function notifyChange(path: string, value: object, type?: string) {
			gi.gameWorker.postMessage({
				ev: InterfaceEvent.EDITOR_OBJECT_UPDATE,
				param: {
					id: object.id,
					path: path,
					value: value,
					type: type || value.constructor.name,
				},
			});
		}

		const pos = gui.addFolder("Position");
		pos.add(object.position, "0", 0, 100).name("X");
		pos.add(object.position, "1", 0, 100).name("Y");
		pos.add(object.position, "2", 0, 100).name("Z");
		pos.onChange(() =>
			notifyChange("position", object.position, "Vector3"),
		);

		const rot = gui.addFolder("Rotation");
		rot.add(object.rotation, "0", 0, Math.PI * 2).name("X");
		rot.add(object.rotation, "1", 0, Math.PI * 2).name("Y");
		rot.add(object.rotation, "2", 0, Math.PI * 2).name("Z");
		rot.onChange(() =>
			notifyChange("rotation", object.rotation, "Euler"),
		);
	}
</script>

<inspector
	class="fixed top-18 right-2 pointer-events-auto"
	bind:this={container}
/>
