<script lang="ts">
	import { getContext, onMount } from "svelte";
	import save from "../../../assets/icons/save.svg";
	import { InterfaceEvent } from "../../../game/types/events/Inteface";
	import { GameEvent } from "../../../game/types/events/Game";
	import Database from "../../../Database";
	import type createEditorContext from "./EditorCtx";

	const ctx = getContext<ReturnType<typeof createEditorContext>>("editor");
	let { selected: inspectorSelection } = ctx;

	let keys: string[] = [];
	let selected = localStorage.getItem("lastgameobject");

	onMount(async () => {
		keys = await Database.getAllKeys("dev", "gameobjects");
	});

	async function select(e: Event) {
		const value = (e.target! as HTMLSelectElement).value;
		if (value == "New +") {
			const name = prompt("Name");
			if (name && !keys.includes(name)) {
				await Database.put("dev", "gameobjects", name, { name, children: [] });
				keys = [...keys, name];
				selected = name;
				$inspectorSelection = undefined;
				self.post(GameEvent.WORLD_LOAD, name);
			} else {
				selected = "dev";
			}
		} else {
			selected = value;
			$inspectorSelection = undefined;
			self.post(GameEvent.WORLD_LOAD, value);
		}
		localStorage.setItem("lastgameobject", selected);
	}
</script>

<selector class="flex">
	<select class="w-16 border-r-0" value={selected} on:change={select}>
		<option>New +</option>
		{#each keys as key}
			<option>{key}</option>
		{/each}
	</select>

	<button
		class="text-base/4 flex items-center pr-0.5 border"
		on:click={() => self.post(InterfaceEvent.EDITOR_SCENE_SAVE)}
	>
		<img src={save} class="w-3 h-3 mx-1" />
		{"Save"}
	</button>
</selector>
