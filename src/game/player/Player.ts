import { AxesHelper, Group } from "three";
import ThirdPersonController from "../controllers/ThirdPersonController";
import { loadGltf } from "../helpers/Loaders";

export default class Player {

  public controller: ThirdPersonController;

  private tiltGroup = new Group();
  private modelGroup = new Group();

  constructor() {
    this.add(this.tiltGroup);

    this.tiltGroup.add(this.modelGroup);

    const ah = new AxesHelper();
    ah.position.y = 0.01;
    this.add(ah);

    this.controller = new ThirdPersonController(this);

    this.loadModel();
  }

  private async loadModel() {
    const gltf = await loadGltf("/models/boxman.glb");

    this.modelGroup.add(gltf.scene);
  }
}