"use strict";
import {Scenario} from "./models/Scenario";
import * as script from "./models/Script";
import {Scene} from "./components/Scene";
import {ChoiceButton} from "./components/ChoiceButton";
import {Config, defaultConfig} from "./Config";
import {ScriptManager, ScriptFunction} from "./ScriptManager";
import {Tag} from "./Constant";

export class Engine {

  private game: g.Game;
  private static scriptManager = new ScriptManager();
  private static _config = defaultConfig;

  constructor(game: g.Game) {
    this.game = game;

    Engine.scriptManager.register(Tag.image, Engine.image);
    Engine.scriptManager.register(Tag.jump, Engine.jump);
    Engine.scriptManager.register(Tag.choice, Engine.choice);
    Engine.scriptManager.register(Tag.text, Engine.text);
    Engine.scriptManager.register(Tag.visible, Engine.visible);
  }

  set config(value: Config) {
    Engine._config = value;
  }

  start(scenario?: Scenario): void {

    const s = scenario ? scenario : Scenario.load();

    const scene = new Scene({
      game: this.game,
      scenario,
      scriptManager: Engine.scriptManager,
      config: Engine.config
    });
    this.game.pushScene(scene);
  }

  script(name: string, f: ScriptFunction) {
    Engine.scriptManager.register(name, f);
  }

  private static get config() {
    return Engine._config;
  }

  private static image(scene: Scene, image: script.Image) {
    const asset = <g.ImageAsset>scene.assets[image.assetId];
    let sprite: g.Sprite;
    if(image.frame) {
      let s = new g.FrameSprite({
        scene,
        src: asset,
        width: image.frame.width,
        height: image.frame.height
      });
      s.frames = image.frame.frames;
      s.interval = 1000;
      s.start();
      sprite = s;
    } else {
      sprite = new g.Sprite({
        scene,
        src: asset
      });
    }
    if(image.x) {
      sprite.x = image.x;
    }
    if(image.y) {
      sprite.y = image.y;
    }
    sprite.invalidate();
    scene.appendE(image.layer, sprite);
  }

  private static jump(scene: Scene, data: script.Jump) {
    const game = scene.game;
    if(scene.source.update(data.label)) {
      game.pushScene(new Scene({
        game,
        scenario: scene.source,
        scriptManager: Engine.scriptManager,
        config: Engine.config
      }));
    } else {
      // TODO: 続行不可能としてタイトルに戻る?
      game.logger.warn("scene not found:" + data.label);
    }
  }

  private static choice(scene: Scene, choice: script.Choice) {
    if(choice.windowTrigger === script.Trigger.Disable) {
      scene.disableMessageWindowTrigger();
    }
    const game = scene.game;
    const count = choice.values.length;
    // TODO: 計算式を書き直す
    const width = choice.width ? choice.width : game.width / 4 * 3;
    const height = choice.height ? choice.height : 32;
    const space = 10;
    const baseX = choice.x ? choice.x : width / 6;
    const baseY = choice.y ? choice.y : (game.height / 3 * 2 - height * count - space * (count - 1)) / 2;
    choice.values.forEach((item: script.ChoiceItem, i: number) => {
      let button = new ChoiceButton({
        scene,
        width,
        height,
        config: Engine.config,
        choice: item,
        assetId: choice.assetId
      });
      button.click.add(() => {
        if(choice.windowTrigger === script.Trigger.Disable) {
          scene.enableMessageWindowTrigger();
        }
        Engine.scriptManager.call(scene, item);
      });
      const direction = choice.direction ? choice.direction : script.Direction.Vertical;
      switch(direction) {
        case script.Direction.Vertical:
          button.move(baseX, baseY + (height + space) * i);
          break;
        case script.Direction.Horizontal:
        button.move(baseX + (width + space) * i, baseY);
          break;
      }
      scene.appendE(choice.layer, button);
    });
  }

  private static text(scene: Scene, text: script.Text) {
    scene.updateText(text.value);
  }

  private static visible(scene: Scene, visibility: script.Visibility) {
    scene.visible(visibility);
  }
}
