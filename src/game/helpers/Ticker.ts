export default class Ticker {
  public active = true;

  private _setActive: (active: boolean) => void;
  private _setTickrate: (rate: number) => void;

  constructor(onUpdate: (delta: number) => void, public tps = 75) {
    let active = true;
    let now;
    let delta;
    let then = performance.now();
    let interval = 1000/tps;

    this._setActive = (a) => active = a;
    this._setTickrate = (rate) => interval = 1000/rate;

    const render = () => {
      if (!active) return;

      now = performance.now();
      delta = now - then;

      if (delta >= interval) {
        then = now - (delta % interval);
        onUpdate(delta / 1000);
      }

      setTimeout(render);
    };

    render();
  }

  public setTickrate(tps: number) {
    this.tps = tps;
    this._setTickrate(tps);
  }

  public cancel() {
    this._setActive(false);
    this.active = false;
  }
}