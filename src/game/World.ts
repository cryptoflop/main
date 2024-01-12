import { Group, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, Vector2, Vector3 } from "three";
import { loadGltf, loadImage } from "./helpers/Loaders";
import { NetEvent } from "./types/events/Net";
import GameObject from "./GameObject";

export default class World extends Group {

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    super();
    this.name = "World";
  }

  public async buildWorld(worldData: string) {
    const worldObj = JSON.parse(worldData || `{ "root": [
			{"name":"Test","uuid":"88b6b45c-a0e8-4b3b-8166-9a2766c93caf","layers":1,"position":[0,0,0],"rotation":[0,0,0,"XYZ"],"children":[{"name":"Testo","uuid":"d1801771-abc3-4474-b80e-9f594b30ec08","layers":1,"position":[0,0,0],"rotation":[0,0,0,"XYZ"]}]}
		] }`);

    for (const child of worldObj.root) {
      this.add(GameObject.parse(child));
    }

    // await this.test();

    DEV: self.editor.notifySceneChange();
  }

  private async test() {
    const geometry = new PlaneGeometry(100, 100);
    geometry.rotateX(-Math.PI / 2);

    const uvTex = await loadImage("/textures/prototype/Dark/texture_08.png");
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

    const ducksById = new Map<number, Object3D>();

    for (let i = 0; i < 2; i++) {
      const id = i + 1;
      const duck = duckModel.clone(false);
      ducksById.set(id, duck);
      units.add(duck);
    }

    self.subscribeNet((param, ev, id) => {
      switch (ev) {
        case NetEvent.HEADING:
          ducksById.get(id!)!.rotation.y = param as number;
          break;
        case NetEvent.MOVEMENT:
          ducksById.get(id!)!.userData.move = ((param as number) & 1) !== 0;
          break;
      }
    }, [NetEvent.HEADING, NetEvent.MOVEMENT]);

    const forthVec = new Vector3();
    self.hookOnRender((delta) => {
      for (const duck of ducksById.values()) {
        if (duck.userData.move) {
          duck.getWorldDirection(forthVec);
          duck.position.addScaledVector(forthVec, 5 * delta);
        }
      }
    }, "before");

    this.add(units);
  }

}