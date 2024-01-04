// import Ticker from "../helpers/Ticker";

export default class Net {

  constructor(public gameChannel: MessagePort) {
    // const socket = new WebSocket("wss://fx-ws.gateio.ws/v4/ws/btc");
    // socket.binaryType = "arraybuffer"
    // socket.addEventListener("message", (ev => {
    //   console.log(ev.data);
    // }));

    // new Ticker(() => {
    //   const array = new Uint8Array(2);
    //   crypto.getRandomValues(array);
    //   array[0] = 1;
    //   gameChannel.postMessage(array.buffer, [array.buffer]);
    // }, 1);
  }

  public destroy() {

  }
}