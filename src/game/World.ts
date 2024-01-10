import { Group, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, Vector2, Vector3 } from "three";
import { loadGltf, loadImage } from "./helpers/Loaders";
import { NetEvent } from "./types/events/Net";
import GameObject from "./game-object/GameObject";

export default class World extends Group {

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    super();
    this.name = "World";
  }

  public async buildWorld(worldData: string) {
    const worldObj = JSON.parse(worldData || `{ "root": [] }`);

    for (const child of worldObj.root) {
      this.add(GameObject.parse(child));
    }

    await this.test();

    DEV: self.editor.notifySceneChange();
  }

  private async test() {
    const geometry = new PlaneGeometry(100, 100);
    geometry.rotateX(-Math.PI / 2);

    const uvTex = await loadImage("/textures/prototype/Green/texture_09.png");
    uvTex.wrapS = RepeatWrapping;
    uvTex.wrapT = RepeatWrapping;
    uvTex.repeat = new Vector2(5, 5);
    const plane = new Mesh(geometry, new MeshBasicMaterial({ map: uvTex }));
    plane.name = "Plane";
    this.add(plane);

    const units = new Group();
    units.name = "Ducks";
    const duckModel = (await loadGltf("/models/duck.glb")).scene.children[0];
    duckModel.name = "Duck";

    function setupDuck(id: number) {
      const duck = duckModel.clone(false);

      let move = false;

      self.subscribeNet((param, ev) => {
        switch (ev) {
          case NetEvent.HEADING:
            duck.rotation.y = param as number;
            break;
          case NetEvent.MOVEMENT:
            // TODO
            move = ((param as number) & 1) !== 0;
            break;
        }
      }, [NetEvent.HEADING, NetEvent.MOVEMENT], [id]);

      const forthVec = new Vector3();
      self.hookOnRender((delta) => {
        if (move) {
          duck.getWorldDirection(forthVec);
          duck.position.addScaledVector(forthVec, 5 * delta);
        }
      }, "before");

      units.add(duck);
    }

    for (let i = 0; i < 500; i++) {
      setupDuck(i + 1);
    }

    this.add(units);
  }

}