<script lang="ts">
	import { getContext, onMount, setContext } from "svelte";
	import Controls from "./Controls.svelte";
	import SceneTree from "./scene-tree/SceneTree.svelte";
	import Inspector from "./inspector/Inspector.svelte";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import type GameInterface from "../../../game/GameInterface";
	import type { TransferableGameObject } from "../../../game/editor/Editor";
	import createEditorContext from "./EditorCtx";

	const gi = getContext<GameInterface>("gameInterface");

	const ctx = createEditorContext();
	setContext<ReturnType<typeof createEditorContext>>("editor", ctx);

	let scene: TransferableGameObject = {
		children: [],
	} as unknown as TransferableGameObject;

	let scripts: string[];

	let { editMode, selected } = ctx;

	onMount(() => {
		self.post(InterfaceEvent.EDITOR_TOGGLE);
		$editMode = !$editMode;

		function replaceObj(
			obj: TransferableGameObject,
			on: TransferableGameObject,
		) {
			for (let i = 0; i < on.children!.length; i++) {
				const child = on.children![i];
				if (child.id === obj.id) {
					on.children!.splice(i, 1, obj);
					if ($selected?.id === obj.id) $selected = obj;
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

		const ue = gi.subscribe(
			(param, ev) => {
				switch (ev) {
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
						if (obj.id === $selected?.id) {
							replaceObj(
								Object.assign(selected, {
									...obj,
									children: $selected.children,
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
				InterfaceEvent.EDITOR_SCRIPT_LIST,
				InterfaceEvent.EDITOR_SCENE_UPDATE,
				InterfaceEvent.EDITOR_OBJECT_UPDATE,
			],
		);

		return () => {
			ue();
			self.post(InterfaceEvent.EDITOR_TOGGLE);
		};
	});

	function createObject(parent?: number) {
		const name = prompt("Name");
		if (!name) return;
		self.post(InterfaceEvent.EDITOR_OBJECT_CREATE, { id: parent, name });
	}
</script>

<editor class="finders-keepers">
	<Controls />

	{#if $editMode}
		<SceneTree
			scene={scene.children}
			bind:selected={$selected}
			on:create={(e) => createObject(e.detail)}
		/>
		{#if $selected}
			<Inspector obj={$selected} scriptList={scripts} />
		{/if}
	{/if}
</editor>
