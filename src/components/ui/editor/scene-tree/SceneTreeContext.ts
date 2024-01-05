import { writable } from "svelte/store";
import { Object3D } from "three";

export function createSceneTreeContext() {
  return writable<Object3D | undefined>(undefined);
}