import { Euler, Vector3, type PerspectiveCamera, Object3D } from "three";
import { InterfaceEvent } from "../types/events/Inteface";

const PI_2 = Math.PI / 2;

export default class EditorController {
  public moveSpeed = 80;
  public pointerSpeed = 1;

  private minPolarAngle = 0;
  private maxPolarAngle = Math.PI;

  private euler = new Euler(0, 0, 0, "YXZ");
  private vector = new Vector3();

  private subs?: () => void;

  constructor(public camera: PerspectiveCamera) {}

  public attach() {
    const upm = self.subscribe(this.onPointerMove.bind(this), [InterfaceEvent.INPUT_POINTER_MOVE]);

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
        const { camera, vector, moveSpeed } = this;
        camera.getWorldDirection(vector);
        if (back) vector.negate();
        camera.position.addScaledVector(vector, moveSpeed * delta);
      }
      if (left || right) {
        const { camera, vector, moveSpeed } = this;
        vector.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(vector, (left ? -moveSpeed : moveSpeed) * delta);
      }
    }, "before");

    this.subs = () => {
      upm();
      ukp();
      urh();
    };
  }

  public dettach() {
    this.subs?.();
  }

  private onPointerMove(values: number[]) {
    const [_, __, movX, movY] = values;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= movX * 0.002 * this.pointerSpeed;
    this.euler.x -= movY * 0.002 * this.pointerSpeed;

    this.euler.x = Math.max(PI_2 - this.maxPolarAngle, Math.min(PI_2 - this.minPolarAngle, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

}