import type { Mesh } from "three";
import GameScript from "./GameScript";
import { loadGltf } from "../helpers/Loaders";

export default class ModelOutlet extends GameScript {

  private mesh?: Mesh;

  constructor() {
    super();
    this.parameters = {
      path: { type: "string" }
    };
  }

  public async onAdded() {
    const path = this.getParameter<string | undefined>("path");
    if (!path) return;
    const duckModel = (await loadGltf(`/models/${path}.glb`)).scene.children[0] as Mesh;
    duckModel.name = "Duck";
    this.object.add(duckModel);
    DEV: self.editor.notifySceneChange(this.object);
  }

  public onParameterChange(param: string) {
    switch(param) {
      case "path":
        if (this.mesh) {
          this.object.remove(this.mesh!);
          this.onRemoved();
        }
        this.onAdded();
        break;
    }
  }

  public onRemoved() {
    this.mesh?.geometry?.dispose(); // TODO...
    this.mesh = undefined;
  }

}