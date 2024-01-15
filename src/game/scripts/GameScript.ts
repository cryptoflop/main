import type { Object3D } from "three";
import type GameObject from "../GameObject";

export type ScriptParameterTypes = "bool" | "float" | "string" | "vector"

export default class GameScript {

  public parameters: Record<string, { type: ScriptParameterTypes, default?: object, label?: string }>;

  public parameterValues: Record<string, unknown> = {};

  constructor(public object: GameObject) {
    this.parameters = {};
    if (this.onBeforeRender) self.hookOnRender(this.onBeforeRender.bind(this), "before");
    if (this.onAfterRender) self.hookOnRender(this.onAfterRender.bind(this), "after");
  }

  public getParameter<T>(name: string): T {
    return this.parameterValues[name] as T ?? this.parameters[name].default as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getObjectByName(name: string): GameObject | Object3D | undefined { return undefined; }

  public onAdded?(): void;

  public onParameterChange?(param: string): void;

  public onPlay?(): void;

  public onPause?(): void;

  public onActiveChange?(): void;

  public onBeforeRender?(delta: number): void;

  public onAfterRender?(delta: number): void;

  public onRemoved?(): void;

}