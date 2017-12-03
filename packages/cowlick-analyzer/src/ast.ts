import * as estree from "estree";
import {LayerConfig, Script} from "cowlick-core";

export type Scenario = Scene[];

export interface Scene {
  label: string;
  frames: Frame[];
}

export interface Frame {
  scripts: Script<any>[];
  label?: string;
}

export interface Choice {
  layer: LayerConfig;
  values: ChoiceItem[];
}

export interface Jump {
  scene?: string;
  frame?: string;
}

export interface ChoiceItem extends Script<Jump> {
  text: string;
  condition?: estree.Node;
}

export interface Condition {
  expression: estree.Node;
  scripts: Script<any>[];
}

export interface IfElse {
  conditions: Condition[];
  elseBody: Script<any>[];
}

export interface WaitTransition {
  scripts: Script<any>[];
  skippable?: boolean;
}
