var core = require("cowlick-core");

module.exports = new core.Scene({
  label: "content",
  frames: [
    new core.Frame([
      {
        tag: "fadeIn",
        data: {
          layer: "test",
          duration: 10
        }
      }
    ]),
    new core.Frame([
      {
        tag: "text",
        data: {
          values: ["テスト"]
        }
      }
    ])
  ]
});
