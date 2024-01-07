export interface EditorInteface {
	notifySceneChange(parent?: import("three").Object3D): void;
}