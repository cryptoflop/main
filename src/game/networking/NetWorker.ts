DEV: (self.document as unknown) = { querySelectorAll() { return []; } };

import Net from "./Net";

let net!: Net;

addEventListener("message", function (message) {
  const { ev, param } = message.data as { ev: string, param: Record<string, unknown> };

  switch (ev) {
    case "init":
      net = new Net(param.gameChannel as MessagePort);
      break;
    case "destroy":
      net.destroy();
      break;
  }
});

postMessage("initialized");