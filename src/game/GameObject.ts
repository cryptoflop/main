import { type Vector3Tuple, type EulerOrder, Object3D } from "three";
import type GameScript from "./scripts/GameScript";

export type SerializedGameObject = {
  name?: string,
	uuid: string,
  layers: number,
  position: Vector3Tuple,
  rotation: [number, number, number, EulerOrder],
	scripts?: { class: string, parameterValues: GameScript["parameterValues"] }[],
  children?: SerializedGameObject[],
}

export default class GameObject extends Object3D {

  public static serialize(obj: GameObject | Object3D, recursive = true): SerializedGameObject {
    return {
      name: obj.name || undefined,
      uuid: obj.uuid,
      layers: obj.layers.mask,
      position: obj.position.toArray(),
      rotation: obj.rotation.toArray() as SerializedGameObject["rotation"],
      scripts: obj.type === "GameObject" ?
        (obj as GameObject).scripts.map(s => ({ class: s.constructor.name, parameterValues: (s as unknown as { parameterValues: GameScript["parameterValues"] }).parameterValues })) :
        undefined,
      children: (obj.children?.length && recursive) ? obj.children.filter(child => !child.type).map(child => GameObject.serialize(child as GameObject)) : undefined
    };
  }

  public static parse(object: SerializedGameObject) {
    const obj = new GameObject();
    if (object.name) obj.name = object.name;
    obj.layers.mask = object.layers;
    obj.uuid = object.uuid;
    obj.position.set(...object.position);
    obj.rotation.set(...object.rotation);

    object.children?.forEach(o => Object3D.prototype.add.call(obj, GameObject.parse(o)));

    return obj;
  }

  public scripts: GameScript[];

  constructor() {
    super();
    (this as unknown as { type: string }).type = "GameObject";
    this.scripts = [];

    this.addEventListener("added", () => {
      this.scripts.forEach(script => script.onAdded?.());
    });
    this.addEventListener("removed", () => {
      this.scripts.forEach(script => script.onRemoved?.());
    });
  }
}