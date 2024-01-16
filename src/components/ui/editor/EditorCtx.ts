import { writable } from "svelte/store";
import type { TransferableGameObject } from "../../../game/editor/Editor";

export default function createEditorContext() {

  return {
    running: writable<boolean>(false),
    editMode: writable<boolean>(false),
    selected: writable<TransferableGameObject | undefined>()
  };
}