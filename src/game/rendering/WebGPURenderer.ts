import Renderer from "three/addons/renderers/common/Renderer.js";
import WebGPUBackend from "three/addons/renderers/webgpu/WebGPUBackend.js";

export default class WebGPURenderer extends Renderer {

  constructor( parameters = {} ) {
    const BackendClass = WebGPUBackend;

    const backend = new BackendClass(parameters);

    super(backend, parameters);

    (this as unknown as { isWebGPURenderer: boolean }).isWebGPURenderer = true;
  }

}