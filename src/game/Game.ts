import { PerspectiveCamera, Scene } from "three";

import Editor from "./editor/Editor";
import Renderer from "./rendering/Renderer";
import World from "./World";
import { GameEvent } from "./types/events/Game";

export default class Game extends Scene {
  public renderer: Renderer;
  public world!: World;

  public camera!: PerspectiveCamera;

  constructor(canvas: OffscreenCanvas, params: number[]) {
    super();
    this.name = "Game";
    this.camera = this.setupCamera(params[0], params[1]);
    this.world = new World(this, this.camera);
    DEV: self.editor = new Editor(this, this.world);
    self.subscribe(this.world.buildWorld.bind(this.world), [GameEvent.WORLD_LOAD]);
    this.add(this.world);
    this.renderer = new Renderer(canvas, params, this.camera, this);
  }

  private setupCamera(width: number, height: number) {
    const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 50);
    return camera;
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