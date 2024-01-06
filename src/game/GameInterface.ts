type EventCallback<T> = (param: T, ev: number) => void

export default class GameInterface {
  private eventListeners: Record<string, EventCallback<unknown>[]> = {};

  public gameWorker!: Worker;
  public netWorker!: Worker;

  private dispatchEvent(ev: number, param: unknown) {
    for (const cb of (this.eventListeners[ev] ?? [])) {
      cb(param, ev);
    }
  }

  private onGameMessage(message: MessageEvent<{ ev: number, param: unknown }>) {
    const { ev, param } = message.data;
    this.dispatchEvent(ev, param);
  }

  private onNetMessage(message: MessageEvent<{ ev: number, param: unknown }>) {
    const { ev, param } = message.data;
    this.dispatchEvent(ev, param);
  }

  public setGameWorker(gameWorker: Worker) {
    this.gameWorker = gameWorker;
    gameWorker.addEventListener("message", this.onGameMessage.bind(this));
  }

  public setNetWorker(netWorker: Worker) {
    this.netWorker = netWorker;
    netWorker.addEventListener("message", this.onNetMessage.bind(this));
  }

  public subscribe<T>(cb: EventCallback<T>, events: number[], bitmasks?: number[]) {
    for (const ev of events) {
      if (!this.eventListeners[ev]) this.eventListeners[ev] = [];
      this.eventListeners[ev].push(cb as EventCallback<unknown>);
    }

    return () => {
      for (const ev of events) {
        const subscribers = this.eventListeners[ev];
        subscribers.splice(subscribers.indexOf(cb as EventCallback<unknown>), 1);
        if (subscribers.length == 0) {
          delete this.eventListeners[ev];
        }
      }
    };
  }

}