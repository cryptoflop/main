<script lang="ts">
	import type { TransferableGameObject } from "../../../../game/editor/Editor";

	import chevronDown from "../../../../assets/icons/chevron-down.svg";
	import chevronRight from "../../../../assets/icons/chevron-right.svg";

	export let object: TransferableGameObject;
	export let selected: TransferableGameObject | undefined;
	export let oncreate: (parent?: number) => void;

	let className = "";
	export { className as class };

	$: {
		if (object.id === selected?.id) {
			object = object;
		}
	}

	let expanded = false;
</script>

<scene-tree-item class="relative flex flex-col {className}">
	<button
		class="flex items-center {!object.children && 'ml-3'}"
		on:click={() => (selected = object === selected ? undefined : object)}
		on:contextmenu={() => oncreate(object.id)}
	>
		{#if object.children}
			<button on:click|stopPropagation={() => (expanded = !expanded)}>
				<img
					src={expanded ? chevronDown : chevronRight}
					class="w-[11px] my-auto -ml-0.5 mr-1"
				/>
			</button>
		{/if}
		<div class={selected === object ? "bg-white/20" : ""}>
			<span>{object.name ?? "Object"}</span>
			<span>[{object.type}]</span>
		</div>
	</button>
	{#if expanded && object.children}
		{#each object.children as child}
			<svelte:self
				class="pl-2.5"
				object={child}
				bind:selected
				{oncreate}
			/>
		{/each}
		<div class="absolute w-px top-4 bottom-1 ml-1 bg-neutral-700" />
	{/if}
</scene-tree-item>
