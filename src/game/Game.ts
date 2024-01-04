import.meta.hot?.invalidate();

import World from "./World";
import Renderer from "./rendering/Renderer";

import { PerspectiveCamera, Scene } from "three";


export default class Game extends Scene {
  public renderer: Renderer;
  public camera: PerspectiveCamera;
  public world: World;

  constructor(canvas: OffscreenCanvas, params: number[]) {
    super();
    this.camera = this.setupCamera(params[0], params[1]);
    this.world = new World(this, this.camera);
    this.renderer = new Renderer(canvas, params, this.camera, this);
  }

  private setupCamera(width: number, height: number) {
    const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1, 5);
    return camera;
  }

  public onBeforeRender() {
    postMessage({ ev: "beforeRenderUpdate" });
  }

  public setDimensions(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setDimensions(width, height);
  }

  public destroy() {
    this.renderer.destroy();
  }
}