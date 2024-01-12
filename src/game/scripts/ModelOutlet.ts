import GameScript from "./GameScript";

export default class ModelOutlet extends GameScript {

  constructor() {
    super();
    this.parameters = {
      path: { type: "string" }
    };
  }

  public onAdded() {
    console.log(this.object);
  }

}