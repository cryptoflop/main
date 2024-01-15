interface Window {
	subscribe: <T>(cb: (param: T, ev: number) => void, events: number[]) => (() => void);
	post: <T>(ev: import("./types/events/Inteface").InterfaceEvent | import("./types/events/Game").GameEvent, param?: T) => void;
	subscribeNet: <T>(cb: (param: T, ev: number, id?: number) => void, events: number[], ids?: number[]) => (() => void);
	postNet: <T>(ev: import("./types/events/Net").NetEvent, param?: T, id?: number) => void;
	hookOnRender: (cb: (delta: number) => void, phase: "before" | "after", order?: number) => () => void;
	editor: import("./editor/Editor").default;
	game: import("./Game").default;
}