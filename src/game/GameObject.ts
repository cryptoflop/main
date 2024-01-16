import { type Vector3Tuple, type EulerOrder, Object3D } from "three";
import type GameScript from "./scripts/GameScript";
import GAME_SCRIPT_CLASS_LIB from "./scripts";
import Database from "../Database";

export type SerializedGameObject = {
  name?: string,
	prefab?: string,
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
      prefab: (obj as GameObject).prefab || undefined,
      uuid: obj.uuid,
      layers: obj.layers.mask,
      position: obj.position.toArray(),
      rotation: obj.rotation.toArray() as SerializedGameObject["rotation"],
      scripts: obj.type === "GameObject" ?
        (obj as GameObject).scripts.map(s => ({ class: s.constructor.name, parameterValues: (s as unknown as { parameterValues: GameScript["parameterValues"] }).parameterValues })) :
        undefined,
      children: (obj.children?.length && recursive) ? obj.children.filter(child => child.type === "GameObject").map(child => GameObject.serialize(child as GameObject)) : undefined
    };
  }

  public static parse(parsed: SerializedGameObject) {
    const obj = new GameObject();

		if (parsed.prefab) {
			Database.get
		}

    if (parsed.name) obj.name = parsed.name;
    obj.layers.mask = parsed.layers;
    obj.uuid = parsed.uuid;
    obj.position.set(...parsed.position);
    obj.rotation.set(...parsed.rotation);

    parsed.scripts?.forEach(s => obj.attachScript(s.class, s.parameterValues, false));

    parsed.children?.forEach(o => Object3D.prototype.add.call(obj, GameObject.parse(o)));

    return obj;
  }

  public prefab: string | undefined;

  public scripts: GameScript[];

  constructor(dynamic = false) {
    super();
    (this as unknown as { type: string }).type = dynamic ? "DynGameObject" : "GameObject";

    this.getObjectById = self.game.getObjectById;
    this.getObjectByName = self.game.getObjectByName;
    this.getObjectByProperty = self.game.getObjectByProperty;
    this.getObjectsByProperty = self.game.getObjectsByProperty;

    this.scripts = [];

    this.addEventListener("added", () => {
      this.scripts.forEach(script => script.onAdded?.());
    });
    this.addEventListener("removed", () => {
      this.scripts.forEach(script => script.onRemoved?.());
    });
  }

  public attachScript(scriptClass: string, paramValues: Record<string, unknown> = {}, runtime = true) {
    const Script = GAME_SCRIPT_CLASS_LIB[scriptClass];
    const script = new Script(this);
    script.object = this;
    script.parameterValues = paramValues;
    this.scripts.push(script);
    if (runtime) script.onAdded?.();
    return script;
  }

  public detachScript(idx: number) {
    const script = this.scripts[idx];
    script.onRemoved?.();
    this.scripts.splice(idx, 1);
  }
}