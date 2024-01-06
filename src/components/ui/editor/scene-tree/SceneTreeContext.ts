import { writable } from "svelte/store";
import type { SceneTreeObj } from "../../../../game/editor/Editor";

export function createSceneTreeContext() {
  return {
    selected: writable<SceneTreeObj | undefined>(undefined),
    action: writable<SceneTreeObj | undefined>(undefined)
  };
}