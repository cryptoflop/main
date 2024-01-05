interface Window {
	editor: import("./editor/EditorInterface").EditorInteface;
	subscribe: <T>(cb: (param: T, ev: number) => void, events: number[], bitmasks?: number[]) => (() => void);
}