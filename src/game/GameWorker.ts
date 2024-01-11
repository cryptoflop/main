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

  const cbNetMap = new Map<number, Map<number, NetEventCallback[]>>();

  netChannel.onmessage = (message: MessageEvent<{ ev: number, param: unknown, id: number }>) => {
    const { ev, param, id } = message.data;
    if (!cbNetMap.has(ev)) return;
    const idMap = cbNetMap.get(ev)!;

    for (const cb of idMap.get(-1)!) {
      cb(param, ev, id);
    }
    for (const cb of idMap.get(id) || []) {
      cb(param, ev, id);
    }
  };

  self.subscribeNet = (cb, events, ids) => {
    for (const ev of events) {
      if (!cbNetMap.has(ev)) cbNetMap.set(ev, new Map().set(-1, []));
      const idMap = cbNetMap.get(ev)!;
      if (ids) {
        for (const id of ids) {
          if (!idMap.has(id)) idMap.set(id, []);
					idMap.get(id)!.push(cb as EventCallback<unknown>);
        }
      } else {
				idMap.get(-1)!.push(cb as EventCallback<unknown>);
      }
    }

    return () => {
      for (const ev of events) {
        const idMap = cbNetMap.get(ev)!;
        if (ids) {
          for (const id of ids) {
            const cbs = idMap.get(id)!;
            cbs.splice(cbs.findIndex(o => o === cb));
            if (cbs.length === 0) idMap.delete(id);
          }
        } else {
          const cbs = idMap.get(-1)!;
          cbs.splice(cbs.findIndex(o => o === cb));
        }
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