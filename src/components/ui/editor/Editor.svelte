<script lang="ts">
	import { getContext, onMount } from "svelte";
	import Controls from "./Controls.svelte";
	import SceneTree from "./scene-tree/SceneTree.svelte";
	import Inspector from "./inspector/Inspector.svelte";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import type GameInterface from "../../../game/GameInterface";
	import type { TransferableGameObject } from "../../../game/editor/Editor";

	const gi = getContext<GameInterface>("gameInterface");

	let scene: TransferableGameObject = {
		children: [],
	} as unknown as TransferableGameObject;
	let selected: TransferableGameObject | undefined;

	let scripts: string[];

	let editMode = false;

	onMount(() => {
		self.post(InterfaceEvent.EDITOR_TOGGLE);

		function replaceObj(
			obj: TransferableGameObject,
			on: TransferableGameObject,
		) {
			for (let i = 0; i < on.children!.length; i++) {
				const child = on.children![i];
				if (child.id === obj.id) {
					on.children!.splice(i, 1, obj);
					if (selected?.id === obj.id) selected = obj;
					return true;
				} else {
					if (child.children) {
						if (replaceObj(obj, child)) {
							return true;
						}
					}
				}
			}
			return false;
		}

		return gi.subscribe(
			(param, ev) => {
				switch (ev) {
					case InterfaceEvent.EDITOR_TOGGLE:
						editMode = !editMode;
						break;
					case InterfaceEvent.EDITOR_SCRIPT_LIST:
						scripts = param as string[];
						break;
					case InterfaceEvent.EDITOR_SCENE_UPDATE:
						if ((param as TransferableGameObject)?.id) {
							replaceObj(param as TransferableGameObject, scene);
							scene = scene;
						} else {
							scene.children = param as TransferableGameObject[];
						}
						break;
					case InterfaceEvent.EDITOR_OBJECT_UPDATE: {
						const obj = param as TransferableGameObject;
						if (obj.id === selected?.id) {
							replaceObj(
								Object.assign(selected, {
									...obj,
									children: selected.children,
								}),
								scene,
							);
							selected = selected;
						}
						break;
					}
				}
			},
			[
				InterfaceEvent.EDITOR_TOGGLE,
				InterfaceEvent.EDITOR_SCENE_UPDATE,
				InterfaceEvent.EDITOR_OBJECT_UPDATE,
				InterfaceEvent.EDITOR_SCRIPT_LIST,
			],
		);
	});

	function createObject(parent?: number) {
		const name = prompt("Name");
		if (!name) return;
		self.post(InterfaceEvent.EDITOR_OBJECT_CREATE, { id: parent, name });
	}
</script>

<editor class="finders-keepers">
	<Controls />

	{#if editMode}
		<SceneTree
			scene={scene.children}
			bind:selected
			on:create={(e) => createObject(e.detail)}
		/>
		{#if selected}
			<Inspector obj={selected} scriptList={scripts} />
		{/if}
	{/if}
</editor>
