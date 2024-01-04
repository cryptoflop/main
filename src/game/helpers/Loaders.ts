import { CanvasTexture, ImageBitmapLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const imageLoader = new ImageBitmapLoader();
const gltfLoader = new GLTFLoader();

export async function loadImage(url: string): Promise<CanvasTexture>;
export async function loadImage<T extends boolean>(url: string, raw: T): Promise<T extends true ? ImageBitmap : CanvasTexture>;
export async function loadImage(url: string, raw?: boolean): Promise<ImageBitmap | CanvasTexture> {
  const img = await imageLoader.loadAsync(url);
  return (raw ? img : new CanvasTexture(img));
}

export async function loadGltf(url: string) {
  return await gltfLoader.loadAsync(url);
}