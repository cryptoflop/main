import type GameObject from "../GameObject";

export type ScriptParameterTypes = "bool" | "float" | "string" | "vector"

export default class GameScript {

  public object!: GameObject;

  public parameters: Record<string, { type: ScriptParameterTypes, default?: object, label?: string }>;

  private parameterValues: Record<string, object> = {};

  constructor() {
    this.parameters = {};
  }

  public getParameter<T>(name: string): T {
    return this.parameterValues[name] as T ?? this.parameters[name].default as T;
  }

  public getObjectByName<T>(): T { return null as T; }

  public onAdded?(): void;

  public onPlay?(): void;

  public onPause?(): void;

  public onActiveChange?(): void;

  public onBeforeRender?(delta: number): void;

  public onAfterRender?(delta: number): void;

  public onRemoved?(): void;

}