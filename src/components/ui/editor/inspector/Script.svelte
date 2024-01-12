<script lang="ts">
	import type { TransferableGameObject } from "../../../../game/editor/Editor";
	import { InterfaceEvent } from "../../../../game/types/events/Inteface";

	export let id: number;
	export let index: number;
	export let script: Exclude<TransferableGameObject["scripts"], undefined>["0"];

	$: params = Object.keys(script.parameters).map((k) => ({
		key: k,
		type: script.parameters[k].type,
		label: script.parameters[k].label ?? k.charAt(0).toUpperCase() + k.slice(1),
		value: script.parameterValues[k] ?? script.parameters[k].default,
	}));

	function changeParam(key: string, value: object) {
		self.post(InterfaceEvent.EDITOR_SCRIPT_PARAM_UPDATE, {
			id,
			index,
			key,
			value,
		});
	}
</script>

<game-script class="border px-1 py-0.5 grid gap-1">
	<div class="text-lg/3">{script.class}</div>
	{#each params as param}
		<div>{param.label}</div>
		<input
			value={param.value}
			on:change={(e) => changeParam(param.key, e.target.value)}
		/>
	{/each}
</game-script>
