import { type Vector3Tuple, type EulerOrder, Object3D } from "three";

export type SerializedGameObject = {
  name?: string,
	uuid: string,
  layers: number,
  up: Vector3Tuple,
  position: Vector3Tuple,
  rotation: [number, number, number, EulerOrder],
  children?: SerializedGameObject[]
}

export default class GameObject extends Object3D {

  public static serialize(obj: GameObject, recursive = true): SerializedGameObject {
    return {
      name: obj.name || undefined,
      uuid: obj.uuid,
      layers: obj.layers.mask,
      up: obj.up.toArray(),
      position: obj.position.toArray(),
      rotation: obj.rotation.toArray() as SerializedGameObject["rotation"],
      children: (obj.children?.length && recursive) ? obj.children.map(child => GameObject.serialize(child)) : undefined
    };
  }

  public static parse(object: SerializedGameObject) {
    const obj = new GameObject();
    if (obj.name) object.name = obj.name;
    obj.layers.mask = object.layers;
    obj.uuid = object.uuid;
    obj.position.set(...object.position);
    obj.rotation.set(...object.rotation);

    object.children?.forEach(o => Object3D.prototype.add.call(obj, GameObject.parse(o)));

    return obj;
  }

  constructor() {
    super();
    (this as unknown as { type: string }).type = "GameObject";
  }

  add(...object: Object3D[]) {
    const ref = super.add(...object);
    DEV: self.editor.notifySceneChange(this);
    return ref;
  }
}