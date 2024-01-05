import { Object3D, type Object3DEventMap } from "three";

export default class GameObject extends Object3D {

  constructor(public active = true) {
    super();
  }

  add(...object: Object3D<Object3DEventMap>[]): this {
    const ref = super.add(...object);
    DEV: self.editor.notifySceneChange(this);
    return ref;
  }

}