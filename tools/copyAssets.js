"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs");
// Copy all the view templates
console.log("copying assets");
shell.cp("-R", "src/public/assets/", "dist/assets/");
console.log("copying views");
shell.cp("-R", "src/views", "dist/views");
