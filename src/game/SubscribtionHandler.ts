// import.meta.hot?.invalidate();

self.subscribe = (cb, events) => {
  const wcb = (msg: MessageEvent) => {
    const { ev, param } = msg.data;
    if (events.includes(ev)) cb(param, ev);
  };
  self.addEventListener("message", wcb);
  return () => self.removeEventListener("message", wcb);
};