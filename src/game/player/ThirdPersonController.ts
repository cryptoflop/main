import { Euler, Vector3, type PerspectiveCamera } from "three";
import type Player from "./Player";

const PI_2 = Math.PI / 2;

export default class ThirdPersonController {
  public pointerSpeed = 1;

  private minPolarAngle = 0;
  private maxPolarAngle = Math.PI;

  private euler = new Euler(0, 0, 0, "YXZ");

  constructor(public player: Player, public camera: PerspectiveCamera) {
    addEventListener("message", message => {
      const { ev, param } = message.data as { ev: string, param: unknown };

      switch (ev) {
        case "INPUT_POINTER_MOVE":
          this.onPointerMove(param as number[]);
          break;
        case "INPUT_KEY_DOWN":
          this.onKey();
          break;
      }
    });
  }

  private onPointerMove(values: number[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, __, movX, movY] = values;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= movX * 0.002 * this.pointerSpeed;
    this.euler.x -= movY * 0.002 * this.pointerSpeed;

    this.euler.x = Math.max(PI_2 - this.maxPolarAngle, Math.min(PI_2 - this.minPolarAngle, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

  private onKey() {
    this.player.position.add(new Vector3(1, 0, 0));
  }

}