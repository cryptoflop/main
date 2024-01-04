import Renderer from "three/addons/renderers/common/Renderer.js";
import WebGPUBackend from "three/addons/renderers/webgpu/WebGPUBackend.js";

if (!self.window) {
  (self as unknown as { window: Record<string, number> }).window = {};
}
if ((window as unknown as Record<string, number>).GPUShaderStage === undefined) {
  (window as unknown as { GPUShaderStage: Record<string, number> }).GPUShaderStage = { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };
}

export default class WebGPURenderer extends Renderer {

  constructor( parameters = {} ) {
    const BackendClass = WebGPUBackend;

    const backend = new BackendClass(parameters);

    super(backend, parameters);

    (this as unknown as { isWebGPURenderer: boolean }).isWebGPURenderer = true;
  }

}