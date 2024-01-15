import ThirdPersonController from "../controllers/ThirdPersonController";
import { NetEvent } from "../types/events/Net";
import GameScript from "./GameScript";
import type GameObject from "../GameObject";
import type { Vector3Tuple } from "three";

export default class Player extends GameScript {

  private id!: number;

  private controller: ThirdPersonController;

  private lastPos: Vector3Tuple;

  constructor(object: GameObject) {
    super(object);
    this.controller = new ThirdPersonController(this.object);
    self.subscribeNet((id: number) => {
      this.id = id;
      console.log("Self: " + id);
    }, [NetEvent.ID_ASSIGEND]);
    this.lastPos = [0,0,0];
  }

  public onAdded() {
    this.controller.attach();
    setInterval(this.onUpdate.bind(this), 1000 / 8);
  }

  private onUpdate() {
    const pos = this.object.position.toArray();
    if (pos.some((v, i) => v != this.lastPos[i])) {
      self.postNet(NetEvent.MOVEMENT, pos);
      this.lastPos = pos;
    }
  }

}