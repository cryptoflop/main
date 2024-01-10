DEV: (self.document as unknown) = { querySelectorAll() { return []; } }; // vite fix

import Net from "./Net";
import type { EventCallback } from "../GameInterface";

function setupIntercom(gameChannel: MessagePort) {
  const cbNetMap = new Map<number, EventCallback<unknown>[]>();

  gameChannel.onmessage = (message: MessageEvent<{ ev: number, param: unknown }>) => {
    const { ev, param } = message.data;
    if (!cbNetMap.has(ev)) return;
    for (const cb of cbNetMap.get(ev)!) {
      cb(param, ev);
    }
  };

  self.subscribeNet = (cb, events, _ids) => {
    for (const ev of events) {
      if (!cbNetMap.has(ev)) cbNetMap.set(ev, []);
			cbNetMap.get(ev)!.push(cb as EventCallback<unknown>);
    }

    return () => {
      for (const ev of events) {
        const cbs = cbNetMap.get(ev)!;
        cbs.splice(cbs.indexOf(cb as EventCallback<unknown>));
      }
    };
  };

  self.postNet = (ev, param, id) => {
    gameChannel.postMessage({ ev, param, id });
  };
}

addEventListener("message", (message) => {
  setupIntercom(message.ports[0]);

  const net = new Net();

  self.addEventListener("message", (message) => message.data === 0 && net.destroy());
}, { once: true });

postMessage("initialized");