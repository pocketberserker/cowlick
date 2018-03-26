var core = require("@cowlick/core");

module.exports = new core.Scene({
  label: "content",
  frames: [
    new core.Frame([
      {
        tag: "layer",
        name: "test",
        x: 2,
        y: 1,
        opacity: 0,
        visible: true
      }
    ])
  ]
});
