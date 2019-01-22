"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileParser_1 = require("../fileParser");
const fs = require("fs");
var buffer = fs.readFileSync("./sample-file.log");
fileParser_1.parseFile(buffer)
    .then(entries => {
    console.log("done");
})
    .catch(err => { throw err; });
//# sourceMappingURL=fileParser-test.js.map