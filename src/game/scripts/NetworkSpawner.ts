import GameObject from "../GameObject";
import { NetEvent } from "../types/events/Net";
import GameScript from "./GameScript";

export default class NetworkSpawner extends GameScript {
  private id!: number;

  private players = new Map<number, GameObject>();

  constructor(object: GameObject) {
    super(object);
    self.subscribeNet((id: number) => this.id = id, [NetEvent.ID_ASSIGEND]);
    self.subscribeNet((pos: number[], _, id) => (id != this.id) && this.onMovementUpdate(id!, pos), [NetEvent.MOVEMENT]);
  }

  private spawnPlayer(id: number) {
    const player = new GameObject();
    player.attachScript("ModelOutlet", { path: "duck"}, false);
    this.object.add(player);
    this.players.set(id, player);
    DEV: self.editor.notifySceneChange(this.object);
  }

  private onMovementUpdate(id: number, pos: number[]) {
    if (!this.players.has(id)) this.spawnPlayer(id);
    const player = this.players.get(id)!;
    player.position.set(...pos as [number, number, number]);
  }

}