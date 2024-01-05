DEV: (self.document as unknown) = { querySelectorAll() { return []; } };

import "./SubscribtionHandler";

import Game from "./Game";

let game!: Game;

addEventListener("message", function (message) {
  const { ev, param } = message.data as { ev: string, param: Record<string, unknown> };

  switch (ev) {
    case "init":
      (self as unknown as { netChannel: MessagePort }).netChannel = param.netChannel as MessagePort;
      game = new Game(param.canvas as OffscreenCanvas, param.param as number[]);
      break;
    case "dimensions":
      game.setDimensions(param.width as number, param.height as number);
      break;
    case "destroy":
      game.destroy();
      break;
  }
});

postMessage("initialized");