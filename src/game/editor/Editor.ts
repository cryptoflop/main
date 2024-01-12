import { Vector3, Object3D, Euler } from "three";
import { InterfaceEvent } from "../types/events/Inteface";
import type Game from "../Game";
import type World from "../World";
import type { SerializedGameObject } from "../GameObject";
import GameObject from "../GameObject";
import EditorController from "../controllers/EditorController";
import GAME_SCRIPT_CLASS_LIB from "../scripts";
import type GameScript from "../scripts/GameScript";

export type TransferableGameObject = SerializedGameObject & {
	id: number,
	type: string,
	scripts?: { class: string, parameters: GameScript["parameters"], parameterValues: GameScript["parameterValues"] }[],
	children?: TransferableGameObject[]
}

export default class Editor {
  public active = false;

  private controller: EditorController;

  constructor(public game: Game, public world: World) {
    this.controller = new EditorController(game.camera);

    self.subscribe(() => {
      this.active = !this.active;
      self.post(InterfaceEvent.EDITOR_TOGGLE);
      self.post(InterfaceEvent.EDITOR_SCRIPT_LIST, Object.keys(GAME_SCRIPT_CLASS_LIB));
      if (this.active) {
        this.onSceneChanged();
        this.controller.attach();
      } else {
        this.controller.dettach();
      }
    }, [InterfaceEvent.EDITOR_TOGGLE]);

    self.subscribe(this.createObject.bind(this), [InterfaceEvent.EDITOR_OBJECT_CREATE]);
    self.subscribe(this.onObjectUpdate.bind(this), [InterfaceEvent.EDITOR_OBJECT_UPDATE]);
    self.subscribe(this.onRefreshRequest.bind(this), [InterfaceEvent.EDITOR_OBJECT_REFRESH]);
    self.subscribe(this.onScriptAttach.bind(this), [InterfaceEvent.EDITOR_SCRIPT_ATTACH]);
  }

  public notifySceneChange(parent?: Object3D) {
    this.onSceneChanged(parent);
  }

  private createObject(param: { id?: number, name: string }) {
    const obj = new GameObject();
    obj.name = param.name;
    if (param?.id) {
      const parent = this.world.getObjectById(param.id)!;
      parent.add(obj);
      this.onSceneChanged(parent);
    } else {
      this.world.add(obj);
      this.onSceneChanged();
    }
  }

  private onScriptAttach(params: { id: number, script: keyof typeof GAME_SCRIPT_CLASS_LIB }) {
    const obj = this.game.getObjectById(params.id)! as GameObject;
    if (obj.type !== "GameObject") {
      console.warn("Can't attach scripts to non GameObjects");
      return;
    }

    const Script = GAME_SCRIPT_CLASS_LIB[params.script];
    const script = new Script();
    script.object = obj;
    obj.scripts.push(script);
    script.onAdded?.();
  }

  private onRefreshRequest(id: number) {
    const obj = this.game.getObjectById(id)!;
    self.post(InterfaceEvent.EDITOR_OBJECT_UPDATE, this.serializeSceneObject(obj, false));
  }

  private onObjectUpdate(update: { id: number, path: string, type: string, value: unknown }) {
    const obj = this.game.getObjectById(update.id)! as unknown as Record<string, unknown>;
    switch (update.type) {
      case "Vector3":
        (obj[update.path] as Vector3).set(...update.value as SerializedGameObject["position"]);
        break;
      case "Euler":
        (obj[update.path] as Euler).set(...update.value as SerializedGameObject["rotation"]);
        break;
      default:
        obj[update.path] = update.value;
        break;
    }
  }

  private serializeSceneObject(obj: GameObject | Object3D, recursive?: boolean): TransferableGameObject {
    return {
      ...GameObject.serialize(obj, recursive),
      id: obj.id,
      type: obj.type,
      scripts: obj.type === "GameObject" ?
        (obj as GameObject).scripts.map(s => ({ class: s.constructor.name, parameters: s.parameters, parameterValues: (s as unknown as { parameterValues: GameScript["parameterValues"] }).parameterValues })) :
        undefined,
      children: obj.children?.length ? obj.children.map(child => this.serializeSceneObject(child)) : undefined
    };
  }

  private onSceneChanged(obj?: Object3D) {
    if (!this.active) return;
    const transferable = this.serializeSceneObject(obj ?? this.world);
    self.post(InterfaceEvent.EDITOR_SCENE_UPDATE, obj ? transferable : transferable.children);
  }

}