import { Group, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene } from "three";
import { loadImage } from "./helpers/Loaders";

export default class World {
  public world!: Group;

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    this.setupScene();
  }

  private async setupScene() {
    this.world = new Group();
    this.world.name = "World";

    const geometry = new PlaneGeometry(50, 50);
    geometry.rotateX(-Math.PI / 2);

    const uvTex = await loadImage("/textures/uv_grid_opengl.jpg");
    const plane = new Mesh(geometry, new MeshBasicMaterial({ map: uvTex }));
    this.world.add(plane);

    this.scene.add(this.world);

  }

}