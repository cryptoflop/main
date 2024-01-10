// import Ticker from "../helpers/Ticker";

import { NetEvent } from "../types/events/Net";

export default class Net {
  private id?: number;

  constructor() {
    const socket = new WebSocket("ws://localhost:3000");
    socket.binaryType = "arraybuffer";

    socket.addEventListener("message", (ev => {
      this.id = Number(ev.data);

      socket.addEventListener("message", (ev => {
        this.parse(ev.data);
      }));
    }), { once: true });

    // new Ticker(() => {
    //   const array = new Uint8Array(2);
    //   crypto.getRandomValues(array);
    //   array[0] = 1;
    //   gameChannel.postMessage(array.buffer, [array.buffer]);
    // }, 1);
  }

  private async parse(data: ArrayBuffer) {
    let cursor = 0;
    const view = new DataView(data);

    while (cursor < data.byteLength) {
      const bytesRead = this.parseMessageChunk(cursor, view);
      cursor += bytesRead;
    }
  }

  private parseMessageChunk(start: number, view: DataView) {
    let cursor = start;
    const numMessages = view.getUint8(cursor);
    cursor += 1;
    const id = view.getUint16(cursor, true);
    cursor += 2;

    for (let i = 0; i < numMessages; i++) {
      const [ev, data, bytesRead] = this.parseEvent(cursor, view);
      self.postNet(ev, data, id);
      cursor += bytesRead;
    }

    return cursor - start;
  }

  private parseEvent(start: number, view: DataView) {
    let cursor = start;
    const ev = view.getUint8(cursor);
    cursor += 1;

    let data: unknown;
    switch(ev) {
      case NetEvent.MOVEMENT:
        data = view.getUint8(cursor);
        cursor += 2;
        break;
      case NetEvent.HEADING:
        data = view.getUint16(cursor, true) / 10000;
        cursor += 2;
        break;
    }

    return [ev, data, cursor - start] as const;
  }

  public destroy() {

  }
}