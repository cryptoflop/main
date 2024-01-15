import type GameScript from "./GameScript";
import ModelOutlet from "./ModelOutlet";
import NetworkSpawner from "./NetworkSpawner";
import Player from "./Player";

const GAME_SCRIPT_CLASS_LIB = {
  ModelOutlet: ModelOutlet,
  Player: Player,
  NetworkSpawner: NetworkSpawner
} as unknown as Record<string, typeof GameScript>;

export default GAME_SCRIPT_CLASS_LIB;