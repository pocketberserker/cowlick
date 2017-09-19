"use strict";
import * as novel from "../../lib/index";

export const title = new novel.Scene({
  label: "title",
  frames: [
    new novel.Frame([
      {
        tag: "visible",
        data: {
          layer: novel.Layer.message,
          visible: false
        }
      },
      {
        tag: "visible",
        data: {
          layer: novel.Layer.system,
          visible: false
        }
      },
      {
        tag: novel.Tag.choice,
        data: {
          layer: novel.Layer.choice,
          values: [
            {
              tag: novel.Tag.jump,
              data: {
                label: "0"
              },
              text: "はじめる"
            }
          ],
          backgroundImage: "pane",
          padding: 4,
          backgroundEffector: {
            borderWidth: 4
          }
        }
      }
    ])
  ]
});