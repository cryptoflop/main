import type GameObject from "./GameObject";

export abstract class GameScript {
  public get active() { return this.object.active; }


  constructor(public object: GameObject) {

  }

  protected getParameter<T>(name: string): T {
    // TODO:
    return null as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getObjectByName<T>(name: string): T { return null as T; }

  protected onStart?(time: number): void;

  protected onActiveChange?(): void;

  protected onBeforeRender?(delta: number): void;

  protected onAfterRender?(delta: number): void;

}