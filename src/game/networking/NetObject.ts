import type { Entity } from "../types/Entity";
import GameObject from "../GameObject";
import { GameScript } from "../GameScript";

let initialized = false;
function ensureHookedNetChannel() {
  if (initialized) return;
  initialized = true;

  (self as unknown as { netChannel: MessagePort }).netChannel.addEventListener("message", msg => {
    const netBuffView = new DataView(msg.data);
    console.log(netBuffView.getUint16(0));
  });
}

// function subscribe(entity: Entity, flags: number) {

// }


export default class NetGameScript extends GameScript {

  constructor(public entity: Entity, public flags: number) {
    super();
    ensureHookedNetChannel();

  }

}