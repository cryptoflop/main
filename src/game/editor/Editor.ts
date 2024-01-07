import { Vector3, Object3D, Euler } from "three";
import { InterfaceEvent } from "../types/events/Inteface";
import type Game from "../Game";
import type World from "../World";
import type { SerializedGameObject } from "../game-object/GameObject";
import GameObject from "../game-object/GameObject";

export type TransferableGameObject = SerializedGameObject & {
	id: number,
	type: string,
	children?: TransferableGameObject[]
}

export default class Editor {
  public active = false;

  constructor(public game: Game, public world: World) {
    self.subscribe(() => {
      this.active = !this.active;
      postMessage({ ev: InterfaceEvent.EDITOR_TOGGLE });
      if (this.active) {
        this.onSceneChanged();
      }
    }, [InterfaceEvent.EDITOR_TOGGLE]);

    self.subscribe(this.onObjectUpdate.bind(this), [InterfaceEvent.EDITOR_OBJECT_UPDATE]);

    self.subscribe(this.createObject.bind(this), [InterfaceEvent.EDITOR_OBJECT_CREATE]);
  }

  public notifySceneChange(parent?: Object3D) {
    this.onSceneChanged(parent);
  }

  public createObject(param: { id?: number, name: string }) {
    const obj = new GameObject();
    obj.name = param.name;
    if (param?.id) {
      const parent = this.world.getObjectById(param.id)!;
      parent.add(obj);
      if (parent.type !== "GameObject") {
        console.warn("Modifying non GameObject");
        this.onSceneChanged();
      }
    } else {
      this.world.add(obj);
      this.onSceneChanged();
    }
  }

  private onObjectUpdate(update: { id: number, path: string, type: string, value: unknown }) {
    const obj = this.game.getObjectById(update.id)! as unknown as Record<string, unknown>;
    switch (update.type) {
      case "Vector3":
        // @ts-expect-error: valid spread
        (obj[update.path] as Vector3).set(...update.value as number[]);
        break;
      case "Euler":
        // @ts-expect-error: valid spread
        (obj[update.path] as Euler).set(...update.value as number[]);
        break;
      default:
        obj[update.path] = update.value;
        break;
    }
  }

  private serializeSceneObject(obj: GameObject | Object3D): TransferableGameObject {
    return {
      ...GameObject.serialize(obj),
      id: obj.id,
      type: obj.type,
      children: obj.children?.length ? obj.children.map(child => this.serializeSceneObject(child)) : undefined
    };
  }

  private onSceneChanged(obj?: Object3D) {
    if (!this.active) return;
    const transferable = this.serializeSceneObject(obj ?? this.world);
    postMessage({ ev: InterfaceEvent.EDITOR_SCENE_UPDATE, param: obj ? transferable : transferable.children });
  }

}