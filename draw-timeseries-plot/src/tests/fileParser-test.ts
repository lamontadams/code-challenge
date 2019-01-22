
import {PairedLogEntries, parseFile} from "../fileParser";
import fs = require("fs");


var buffer = fs.readFileSync("./MRSI_VISION.log");
parseFile(buffer)
.then(entries => {
    console.log("done");
})
.catch(err => { throw err; });

