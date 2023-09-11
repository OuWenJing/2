const fs = require("fs-extra");
const path = require("path");
require("colors-cli/toxic");

const {
  createSVG,
  createTTF,
  createWOFF,
  createWOFF2,
  createJSON,
  createCSS,
  processFiles
} = require("./utils");

module.exports = async function create (options) {
  if (!options) options = {};
  options.dist = options.dist || path.join(process.cwd(), "fonts");
  options.src = options.src || path.join(process.cwd(), "svg");
  options.fontsUrl = options.fontsUrl || path.join(process.cwd(), "font/fonts");
  options.fontName = options.fontName || "iconfont";
  options.svgicons2svgfont = options.svgicons2svgfont || {
    fontHeight: 1000,
    fixedWidth: true,
    normalize: true
  };
  options.svgicons2svgfont.fontName = options.svgicons2svgfont.fontName || options.fontName;
  options.classNamePrefix = options.classNamePrefix || options.fontName;
  options.suffix = 'fill'

  // organize folders
  if (fs.existsSync(options.dist)) {
    if (fs.existsSync(options.fontsUrl)) {
      fs.readdirSync(options.fontsUrl).forEach((file) => {
        fs.unlinkSync(path.join(options.fontsUrl, file));
      });
      fs.rmdirSync(options.fontsUrl);
    }
    fs.readdirSync(options.dist).forEach((file) => {
      fs.unlinkSync(path.join(options.dist, file));
    });

    fs.rmdirSync(options.dist);
  }
  fs.mkdirSync(options.dist)

  // start create icons

  let cssString = [];
  let unicodeObj

  return createSVG(options)
    .then((UnicodeObject) => {
      unicodeObj = JSON.parse(JSON.stringify(UnicodeObject))
      Object.keys(UnicodeObject).forEach(name => {
        let _code = UnicodeObject[name];
        cssString.push(`.${options.classNamePrefix}-${name}::before { content: "\\${_code.charCodeAt(0).toString(16)}"; }\n`);
      });
    })
    .then(() => createTTF(options))
    .then(() => createWOFF(options))
    .then(() => createWOFF2(options))
    .then(() => createCSS(options, cssString))
    .then(() => createJSON(options, unicodeObj))
    .then(() => processFiles(options))
}