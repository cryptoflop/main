import type { Object3D } from "three";
import type Game from "../Game";
import { InterfaceEvent } from "../types/events/Inteface";

// import.meta.hot?.invalidate();

export default class Editor {
  public active = false;

  constructor(public game: Game) {
    self.subscribe(() => {
      this.active = !this.active;
      postMessage({ ev: InterfaceEvent.EDITOR_TOGGLE, param: this.active });
      if (this.active) {
        this.onSceneChanged();
      }
    }, [InterfaceEvent.EDITOR_TOGGLE]);
  }

  private onSceneChanged(obj?: Object3D) {
    // (obj ?? this.game).traverse(obj => {})
    if (!this.active) return;
    postMessage({ ev: InterfaceEvent.EDITOR_SCENE_UPDATE, param: this.game.toJSON().object });
  }

  public notifySceneChange(parent: Object3D) {
    this.onSceneChanged(parent);
  }

}