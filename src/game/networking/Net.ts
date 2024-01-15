// import Ticker from "../helpers/Ticker";

import { NetEvent } from "../types/events/Net";

export default class Net {
  private id?: number;

  constructor() {
    const socket = new WebSocket("ws://localhost:3000");
    socket.binaryType = "arraybuffer";

    socket.addEventListener("message", (ev => {
      const [id, begin, tickRate] = ev.data.toString().split("|").map(Number);
      this.id = id;
      self.postNet(NetEvent.ID_ASSIGEND, id);

      socket.addEventListener("message", (ev => {
        this.parse(ev.data);
      }));
    }), { once: true });

    self.subscribeNet((param, ev) => {
      switch(ev) {
        case NetEvent.MOVEMENT: {
          const pos = param as number[];
          const buffer = new ArrayBuffer(1 + (4 * 3));
          const view = new DataView(buffer);
          view.setUint8(0, NetEvent.MOVEMENT);
          view.setFloat32(1 + 0, pos[0], true);
          view.setFloat32(1 + 4, pos[1], true);
          view.setFloat32(1 + 8, pos[2], true);
          socket.send(buffer);
          break;
        }
      }
    }, [NetEvent.MOVEMENT]);
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
        data = [
          view.getFloat32(cursor + 0, true),
          view.getFloat32(cursor + 4, true),
          view.getFloat32(cursor + 8, true)
        ];
        cursor += 4 * 3;
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