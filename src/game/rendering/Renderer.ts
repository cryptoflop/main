// import.meta.hot?.invalidate();

import { Camera, Scene } from "three";

import WebGPURenderer from "./WebGPURenderer";

import Ticker from "../helpers/Ticker";
import { InterfaceEvent } from "../types/events/Inteface";

export default class Renderer {
  public canvas: OffscreenCanvas;
  public renderer: WebGPURenderer;

  private ticker: Ticker;

  constructor(canvas: OffscreenCanvas, params: number[], camera: Camera, scene: Scene) {
    this.canvas = canvas;

    const [width, height, pixelRatio] = params;

    const renderer = new WebGPURenderer({ canvas: canvas, antialias: false });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    this.renderer = renderer;

    const hooks: ((delta: number) => void)[] = [];
    self.hookOnRender = (cb, _phase: "before" | "after", _order?: number) => {
      hooks.push(cb);
      return () => hooks.splice(hooks.indexOf(cb));
    };

    const render = renderer.render.bind(renderer, scene, camera);
    this.ticker = new Ticker((delta) => {
      hooks.forEach(cb => cb(delta));
      render();
    }, (fps) => self.post(InterfaceEvent.FPS_UPDATE, fps), 1000);
  }

  public setFPS(fps: number) {
    this.ticker.setTickrate(fps);
  }

  public setDimensions(width: number, height: number) {
    this.renderer.setSize(width, height, false);
  }

  public destroy() {
    this.ticker.cancel();
  }
}