import { Euler, type PerspectiveCamera } from "three";
import { GameScript } from "../GameScript";
import { InterfaceEvent } from "../types/events/Inteface";

const PI_2 = Math.PI / 2;

export default class ThirdPersonController extends GameScript {
  public pointerSpeed = 1;

  public camera!: PerspectiveCamera;

  private minPolarAngle = 0;
  private maxPolarAngle = Math.PI;

  private euler = new Euler(0, 0, 0, "YXZ");

  protected onStart() {
    this.camera = this.getObjectByName("camera");
    self.subscribe(this.onPointerMove.bind(this), [InterfaceEvent.INPUT_POINTER_MOVE]);
  }

  private onPointerMove(values: number[]) {
    if (!this.active) return;
    const [_, __, movX, movY] = values;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= movX * 0.002 * this.pointerSpeed;
    this.euler.x -= movY * 0.002 * this.pointerSpeed;

    this.euler.x = Math.max(PI_2 - this.maxPolarAngle, Math.min(PI_2 - this.minPolarAngle, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

}