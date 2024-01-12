import type GameScript from "./GameScript";
import ModelOutlet from "./ModelOutlet";

const GAME_SCRIPT_CLASS_LIB = {
  ModelOutlet: ModelOutlet
} as unknown as Record<string, typeof GameScript>;

export default GAME_SCRIPT_CLASS_LIB;