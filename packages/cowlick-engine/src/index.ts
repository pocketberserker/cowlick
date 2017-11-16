"use strict";
import {Engine} from "./Engine";
export {ScriptFunction} from "./scripts/ScriptManager";
export {defaultScripts} from "./scripts/defaultScripts";
export * from "./models/GameState";
export {SceneController} from "./components/SceneController";
export {GameScene} from "./components/GameScene";
export {SaveLoadScene} from "./components/SaveLoadScene";

/**
 * ノベルエンジンインスタンス
 */
export const engine = new Engine(g.game);
