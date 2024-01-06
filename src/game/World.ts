import { Group, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, Scene } from "three";
import { loadImage } from "./helpers/Loaders";

export type GameObject = Object3D & { parameters?: object }
export type WorldData = GameObject

export default class World extends Group {

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    super();
    this.name = "World";
  }

  public buildWorld(world: WorldData) {

    // const geometry = new PlaneGeometry(50, 50);
    // geometry.rotateX(-Math.PI / 2);

    // const uvTex = await loadImage("/textures/uv_grid_opengl.jpg");
    // const plane = new Mesh(geometry, new MeshBasicMaterial({ map: uvTex }));
    // this.world.add(plane);

    // this.scene.add(this.container);

  }

}