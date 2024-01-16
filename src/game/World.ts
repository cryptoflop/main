import { Group, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, Vector2 } from "three";
import { loadImage } from "./helpers/Loaders";
import GameObject, { type SerializedGameObject } from "./GameObject";
import Database from "../Database";

export default class World extends Group {

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    super();
    this.name = "World";
  }

  private clearWorld() {
    this.traverse(o => {
      if (o.type.includes("GameObject") && o.parent !== this) {
        (o as GameObject).scripts.forEach(s => s.onRemoved?.());
      }
    });
    this.clear();
  }

  public async loadWorld(world: string) {
    this.clearWorld();

    let worldObj: { name: string, children: SerializedGameObject[] };
    let dev = false;
    DEV: dev = true;
    if (dev) {
      const db = await Database.open("dev", db => db.createObjectStore("gameobjects"));
      worldObj = await Database.get(db, "gameobjects", world, { name: "dev", children: [] });
    } else {
      worldObj = JSON.parse(world || `{"name":"dev","children":[]}`);
    }

    this.name = worldObj.name;

    for (const child of worldObj!.children || []) {
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

    // const units = new Group();
    // units.name = "Ducks";
    // const duckModel = (await loadGltf("/models/duck.glb")).scene.children[0];
    // duckModel.name = "Duck";

    // const ducksById = new Map<number, Object3D>();

    // for (let i = 0; i < 2; i++) {
    //   const id = i + 1;
    //   const duck = duckModel.clone(false);
    //   ducksById.set(id, duck);
    //   units.add(duck);
    // }

    // self.subscribeNet((param, ev, id) => {
    //   switch (ev) {
    //     case NetEvent.HEADING:
    //       ducksById.get(id!)!.rotation.y = param as number;
    //       break;
    //     case NetEvent.MOVEMENT:
    //       ducksById.get(id!)!.userData.move = ((param as number) & 1) !== 0;
    //       break;
    //   }
    // }, [NetEvent.HEADING, NetEvent.MOVEMENT]);

    // const forthVec = new Vector3();
    // self.hookOnRender((delta) => {
    //   for (const duck of ducksById.values()) {
    //     if (duck.userData.move) {
    //       duck.getWorldDirection(forthVec);
    //       duck.position.addScaledVector(forthVec, 5 * delta);
    //     }
    //   }
    // }, "before");

    // this.add(units);
  }

}