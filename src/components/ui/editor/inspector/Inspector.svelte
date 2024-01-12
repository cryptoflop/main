<script lang="ts">
	import { onMount } from "svelte";
	import Text from "./Text.svelte";
	import Vector from "./Vector.svelte";
	import { InterfaceEvent } from "../../../../game/types/events/Inteface";
	import type { TransferableGameObject } from "../../../../game/editor/Editor";
	import Script from "./Script.svelte";

	export let obj: TransferableGameObject;
	export let scriptList: string[];

	let selectedScript: string | undefined;

	function notifyChange(path: string, value: object, type?: string) {
		(obj as unknown as Record<string, object>)[path] = value;
		self.post(InterfaceEvent.EDITOR_OBJECT_UPDATE, {
			id: obj.id,
			path: path,
			value: value,
			type: type || value.constructor.name,
		});
	}

	onMount(() => {
		const iid = setInterval(
			() => obj.id && self.post(InterfaceEvent.EDITOR_OBJECT_REFRESH, obj.id),
			125,
		);
		return () => clearInterval(iid);
	});
</script>

<inspector
	class="fixed top-16 right-2 pointer-events-auto grid gap-1 p-2 bg-black border text-base/3"
>
	<label class="text-lg/3 mb-1.5 ml-0.5">Inspector</label>
	<Text
		label="Name"
		value={obj.name}
		on:change={(e) => notifyChange("name", e.detail)}
	/>
	<Vector
		value={obj.position}
		on:change={(e) => notifyChange("position", e.detail, "Vector3")}
	/>
	<Vector
		value={obj.rotation.slice(0, -1)}
		on:change={(e) => notifyChange("rotation", e.detail, "Euler")}
	/>

	{#if obj.type === "GameObject"}
		{#if obj.scripts}
			{#each obj.scripts as script, i}
				<Script {script} index={i} id={obj.id} />
			{/each}
		{/if}

		<div class="grid grid-cols-[1fr,min-content]">
			<select bind:value={selectedScript}>
				{#each scriptList as scriptName}
					<option>{scriptName}</option>
				{/each}
			</select>
			<button
				on:click={() =>
					self.post(InterfaceEvent.EDITOR_SCRIPT_ATTACH, {
						id: obj.id,
						script: selectedScript,
					})}>Add</button
			>
		</div>
	{/if}
</inspector>
