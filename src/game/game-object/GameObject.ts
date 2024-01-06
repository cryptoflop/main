import { type Vector3Tuple, type EulerOrder, Object3D, Layers } from "three";

export type SerializedGameObject = {
	id: number,
	name?: string,
	type: string,
	layers: number,
	up: Vector3Tuple,
	position: Vector3Tuple,
	rotation: [number, number, number, EulerOrder],
	children?: SerializedGameObject[]
}

export function wrap(obj: Object3D) {

}

export function parse(object: SerializedGameObject) {
  let obj: Object3D;
  switch (object.type) {
    case "Object3D":
      obj = new Object3D();
      break;
    case "Mesh":
			
      break;
  }

  if (obj.name) parsed.name = obj.name;
  parsed.layers.mask = obj.layers;
  parsed.type = "GameObject";

  obj.children?.forEach(o => Object3D.prototype.add.call(parsed, GameObject.parse(o)));

  return parsed;
}