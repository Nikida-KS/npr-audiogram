var fs = require("fs"),
    path = require("path"),
    Canvas = require("canvas"),
    getRenderer = require("../renderer/"),
    serverSettings = require("../settings/");

function initializeCanvas(options, cb) {

  // Fonts pre-registered in bin/worker

  var canvas = new Canvas(options.width, options.height),
      context = canvas.getContext("2d"),
      renderer = getRenderer(context).update(options);

  renderer.caption = options.caption;

  if (!options.backgroundImage && !options.foregroundImage) {
    return cb(null, renderer);
  }

  // Load background image from file (done separately so renderer code can work in browser too)
  if (options.backgroundImage) {
    fs.readFile(path.join(__dirname, "..", "settings", "backgrounds", options.backgroundImage), function(err, raw){

      if (err) {
        return cb(err);
      }

      var bg = new Canvas.Image;
      bg.src = raw;
      renderer.backgroundImage = bg;

      return cb(null, renderer);

    });
  }

  if (options.foregroundImage) {
    fs.readFile(path.join(__dirname, "..", "settings", "backgrounds", options.foregroundImage), function(err, raw){

      if (err) {
        return cb(err);
      }

      var fg = new Canvas.Image;
      fg.src = raw;
      renderer.foregroundImage = fg;

      return cb(null, renderer);
    });
  }

}

module.exports = initializeCanvas;
