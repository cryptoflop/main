import { Vector3, type EulerOrder, Object3D, type Vector3Tuple, Euler } from "three";
import { InterfaceEvent } from "../types/events/Inteface";
import type Game from "../Game";
import type World from "../World";

export type SceneTreeObj = {
	id: number,
	name?: string,
	type: string,
	layers: number,
	up: Vector3Tuple,
	position: Vector3Tuple,
	rotation: [number, number, number, EulerOrder],
	children?: SceneTreeObj[]
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

  private createObject(param: { id?: number, name: string }) {
    const obj = new Object3D();
    obj.name = param.name;

    this.world.add(obj);
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

  private buildSceneItem(obj: Object3D): SceneTreeObj {
    return {
      id: obj.id,
      name: obj.name || undefined,
      type: obj.type,
      layers: obj.layers.mask,
      up: obj.up.toArray(),
      position: obj.position.toArray(),
      rotation: obj.rotation.toArray() as SceneTreeObj["rotation"],
      children: obj.children?.length ? obj.children.map(child => this.buildSceneItem(child)) : undefined
    };
  }

  private onSceneChanged(obj?: Object3D) {
    if (!this.active) return;
    postMessage({ ev: InterfaceEvent.EDITOR_SCENE_UPDATE, param: { parent: obj?.id, tree: this.buildSceneItem(obj ?? this.world) } });
  }

  public notifySceneChange(parent: Object3D) {
    this.onSceneChanged(parent);
  }

}