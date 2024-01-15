import { Vector3, Object3D } from "three";
import { InterfaceEvent } from "../types/events/Inteface";

export default class ThirdPersonController {
  public moveSpeed = 40;
  public pointerSpeed = 1;

  private vector = new Vector3();

  private subs?: () => void;

  constructor(public object: Object3D) {}

  public attach() {

    let forth = false, back = false, left = false, right = false;
    const ukp = self.subscribe((key: string, ev) => {
      if (ev === InterfaceEvent.INPUT_KEY_DOWN) {
        if (key === "w") forth = true;
        if (key === "s") back = true;
        if (key === "a") left = true;
        if (key === "d") right = true;
      } else {
        if (key === "w") forth = false;
        if (key === "s") back = false;
        if (key === "a") left = false;
        if (key === "d") right = false;
      }
    }, [InterfaceEvent.INPUT_KEY_DOWN, InterfaceEvent.INPUT_KEY_UP]);

    const urh = self.hookOnRender((delta) => {
      if (forth || back) {
        const { vector, moveSpeed, object } = this;
        object.getWorldDirection(vector);
        if (back) vector.negate();
        object.position.addScaledVector(vector, moveSpeed * delta);
      }
      if (left || right) {
        const { vector, moveSpeed, object } = this;
        vector.setFromMatrixColumn(object.matrix, 0);
        object.position.addScaledVector(vector, (left ? -moveSpeed : moveSpeed) * delta);
      }
    }, "before");

    this.subs = () => {
      ukp();
      urh();
    };
  }

  public dettach() {
    this.subs?.();
  }

}