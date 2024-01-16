import { Vector3, Object3D, Euler } from "three";
import { InterfaceEvent } from "../types/events/Inteface";
import type Game from "../Game";
import type World from "../World";
import type { SerializedGameObject } from "../GameObject";
import GameObject from "../GameObject";
import EditorController from "../controllers/EditorController";
import GAME_SCRIPT_CLASS_LIB from "../scripts";
import type GameScript from "../scripts/GameScript";
import Database from "../../Database";

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
      if (this.active) {
        this.onSceneChanged();
        this.controller.attach();
        self.post(InterfaceEvent.EDITOR_SCRIPT_LIST, Object.keys(GAME_SCRIPT_CLASS_LIB));
      } else {
        this.controller.dettach();
      }
    }, [InterfaceEvent.EDITOR_TOGGLE]);

    self.subscribe(this.createObject.bind(this), [InterfaceEvent.EDITOR_OBJECT_CREATE]);
    self.subscribe(this.onObjectUpdate.bind(this), [InterfaceEvent.EDITOR_OBJECT_UPDATE]);
    self.subscribe(this.onRefreshRequest.bind(this), [InterfaceEvent.EDITOR_OBJECT_REFRESH]);
    self.subscribe(this.onScriptAttach.bind(this), [InterfaceEvent.EDITOR_SCRIPT_ATTACH]);
    self.subscribe(this.onScriptParamUpdate.bind(this), [InterfaceEvent.EDITOR_SCRIPT_PARAM_UPDATE]);
    self.subscribe(this.onSceneSave.bind(this), [InterfaceEvent.EDITOR_SCENE_SAVE]);
  }

  public notifySceneChange(parent?: Object3D) {
    this.onSceneChanged(parent);
  }

  private async onSceneSave() {
    await Database.put("dev", "gameobjects", this.world.name, GameObject.serialize(this.world));
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

  private saveGetObjectById(id: number) {
    const obj = this.game.getObjectById(id)! as GameObject;
    if (obj.type !== "GameObject") {
      console.log(obj);
      throw "Trying to modify a non GameObjects";
    }
    return obj;
  }

  private onScriptAttach(params: { id: number, script: keyof typeof GAME_SCRIPT_CLASS_LIB }) {
    const obj = this.saveGetObjectById(params.id);
    obj.attachScript(params.script);
  }

  private onScriptParamUpdate(params: { id: number, index: number, key: string, value: object }) {
    const obj = this.saveGetObjectById(params.id);
    const script = obj.scripts[params.index];
    (script as unknown as { parameterValues: Record<string, object> }).parameterValues[params.key] = params.value;
    script.onParameterChange?.(params.key);
    this.sendGameObjectUpdate(obj);
  }

  private sendGameObjectUpdate(obj: GameObject | Object3D) {
    self.post(InterfaceEvent.EDITOR_OBJECT_UPDATE, this.serializeSceneObject(obj, false));
  }

  private onRefreshRequest(id: number) {
    const obj = this.game.getObjectById(id)!;
    this.sendGameObjectUpdate(obj);
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