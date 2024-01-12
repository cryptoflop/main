<script lang="ts">
	import type { TransferableGameObject } from "../../../../game/editor/Editor";

	export let script: Exclude<TransferableGameObject["scripts"], undefined>["0"];

	$: params = Object.keys(script.parameters);
</script>

<game-script class="border px-1 py-0.5 grid gap-1">
	<div class="text-lg/3">{script.class}</div>
	{#each params as param}
		<div>
			{script.parameters[param].label ??
				param.charAt(0).toUpperCase() + param.slice(1)}
		</div>
	{/each}
</game-script>
