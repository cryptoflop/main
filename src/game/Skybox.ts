import { Color, Fog, type Scene } from "three";


export default class Skybox {

  constructor(scene: Scene) {
    scene.fog = new Fog(0x101020, 2, 600);
    scene.background = new Color(0x101020);
  }

}