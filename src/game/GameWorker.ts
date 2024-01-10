DEV: (self.document as unknown) = { querySelectorAll() { return []; } }; // vite fix

import Game from "./Game";
import { GameEvent } from "./types/events/Game";
import type { EventCallback } from "./GameInterface";

type NetEventCallback = Parameters<typeof self.subscribeNet>["0"];

function setupIntercom(netChannel: MessagePort) {
  const cbMap = new Map<number, EventCallback<unknown>[]>();

  self.addEventListener("message", (message: MessageEvent<{ ev: number, param: unknown }>) => {
    const { ev, param } = message.data;
    if (!cbMap.has(ev)) return;
    for (const cb of cbMap.get(ev)!) {
      cb(param, ev);
    }
  });

  self.subscribe = (cb, events) => {
    for (const ev of events) {
      if (!cbMap.has(ev)) cbMap.set(ev, []);
			cbMap.get(ev)!.push(cb as EventCallback<unknown>);
    }

    return () => {
      for (const ev of events) {
        const cbs = cbMap.get(ev)!;
        cbs.splice(cbs.indexOf(cb as EventCallback<unknown>));
      }
    };
  };

  self.post = (ev, param) => {
    self.postMessage({ ev, param });
  };

  const cbNetMap = new Map<number, [NetEventCallback, number[] | undefined][]>();

  netChannel.onmessage = (message: MessageEvent<{ ev: number, param: unknown, id: number }>) => {
    const { ev, param, id } = message.data;
    if (!cbNetMap.has(ev)) return;
    for (const entry of cbNetMap.get(ev)!) {
      const [cb, ids] = entry;
      if (ids?.length) {
        if (!ids!.includes(id)) continue;
      }
      cb(param, ev, id);
    }
  };

  self.subscribeNet = (cb, events, ids) => {
    for (const ev of events) {
      if (!cbNetMap.has(ev)) cbNetMap.set(ev, []);
			cbNetMap.get(ev)!.push([cb as EventCallback<unknown>, ids]);
    }

    return () => {
      for (const ev of events) {
        const cbs = cbNetMap.get(ev)!;
        cbs.splice(cbs.findIndex(o => o[0] === cb));
      }
    };
  };

  self.postNet = (ev, param, _id) => {
    netChannel.postMessage({ ev, param });
  };
}

addEventListener("message", (message) => {
  const initParams = message.data as { canvas: OffscreenCanvas, screen: number[] };

  setupIntercom(message.ports[0]);

  const game = new Game(initParams.canvas, initParams.screen);

  self.subscribe((p: { width: number, height: number }) => game.setDimensions(p.width, p.height), [GameEvent.DIMENSIONS_CHANGE]);
  self.subscribe(game.destroy, [0]);
}, { once: true });

postMessage("initialized");