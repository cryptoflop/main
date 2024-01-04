import { AxesHelper, Group, type PerspectiveCamera } from "three";
import ThirdPersonController from "./ThirdPersonController";
import { loadGltf } from "../helpers/Loaders";
import NetObject from "../networking/NetObject";

export default class Player extends NetObject {

  public controller: ThirdPersonController;

  private tiltGroup = new Group();
  private modelGroup = new Group();

  constructor(camera: PerspectiveCamera) {
    super(1, 2);

    this.add(this.tiltGroup);

    this.tiltGroup.add(this.modelGroup);

    const ah = new AxesHelper();
    ah.position.y = 0.01;
    this.add(ah);

    this.controller = new ThirdPersonController(this, camera);

    this.loadModel();
  }

  private async loadModel() {
    const gltf = await loadGltf("/models/boxman.glb");

    this.modelGroup.add(gltf.scene);
  }
}