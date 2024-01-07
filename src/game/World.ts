import { Group, PerspectiveCamera, Scene } from "three";
import GameObject from "./game-object/GameObject";

export default class World extends Group {

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    super();
    this.name = "World";
  }

  public buildWorld(worldData: string) {
    const worldObj = JSON.parse(worldData || `{ "root": [] }`);

    for (const child of worldObj.root) {
      this.add(GameObject.parse(child));
    }

    DEV: self.editor.notifySceneChange();
    // const geometry = new PlaneGeometry(50, 50);
    // geometry.rotateX(-Math.PI / 2);

    // const uvTex = await loadImage("/textures/uv_grid_opengl.jpg");
    // const plane = new Mesh(geometry, new MeshBasicMaterial({ map: uvTex }));
    // this.world.add(plane);

    // this.scene.add(this.container);
  }

}