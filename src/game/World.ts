import { Group, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene } from "three";
import Skybox from "./Skybox";
import { loadImage } from "./helpers/Loaders";
import Player from "./player/Player";

export default class World {
  public skybox: Skybox;
  public world!: Group;
  public player!: Player;

  constructor(public scene: Scene, public camera: PerspectiveCamera) {
    this.skybox = new Skybox(this.scene);
    this.setupScene();
  }

  private async setupScene() {
    this.world = new Group();

    const geometry = new PlaneGeometry(50, 50);
    geometry.rotateX(-Math.PI / 2);

    const uvTex = await loadImage("/textures/uv_grid_opengl.jpg");
    const plane = new Mesh(geometry, new MeshBasicMaterial({ map: uvTex }));
    this.world.add(plane);

    this.scene.add(this.world);

    this.spawnPlayer();
  }

  public spawnPlayer() {
    this.player = new Player(this.camera);
    this.world.add(this.player);
  }

}