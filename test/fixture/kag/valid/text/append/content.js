import {Scenario, Scene, Frame} from "cowlick";

module.exports = new Scenario([
  new Scene({
    label: "content",
    frames: [
      new Frame([
        {
          tag: "text",
          data: {
            values: [
              "テスト"
            ]
          }
        }
      ]),
      new Frame([
        {
          tag: "text",
          data: {
            values: [
              "\n1"
            ]
          }
        }
      ])
    ]
  })
]);