"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logEntry_1 = require("./logEntry");
const stream_1 = require("stream");
const LineByLineReader = require("line-by-line");
function parseFile(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        let stream = new stream_1.Stream.PassThrough();
        stream.end(buffer);
        let reader = new LineByLineReader(stream);
        return new Promise((resolve, reject) => {
            readFile(reader, resolve, reject);
        });
    });
}
exports.parseFile = parseFile;
class PairedLogEntry {
}
exports.PairedLogEntry = PairedLogEntry;
function readFile(reader, success, error) {
    let results = new Array();
    let lastVisionDataLogEntry = null;
    reader.on("line", (line) => {
        try {
            let logEntry = logEntry_1.getLogEntry(line);
            if (logEntry.getEntryType() === logEntry_1.EntryType.Score) {
                if (lastVisionDataLogEntry === null) {
                    console.error("Line at timestamp %s contains a score with no preceeding VisionData. Raw text: %s", logEntry.TimeStamp, logEntry.Text);
                }
                else {
                    console.debug("Matched Score entry at %s with VisionData entry at %s", logEntry.Text, lastVisionDataLogEntry.TimeStamp);
                    results.push({ VisionData: lastVisionDataLogEntry, Score: logEntry });
                    lastVisionDataLogEntry = null;
                }
            }
            else if (logEntry.getEntryType() == logEntry_1.EntryType.VisionData) {
                console.debug("Found VisionData entry at %s", logEntry.TimeStamp);
                if (lastVisionDataLogEntry !== null) {
                    console.debug("Replacing VisionData entry from %s", lastVisionDataLogEntry.TimeStamp);
                }
                lastVisionDataLogEntry = logEntry;
            }
            else {
                console.debug("Skipping entry at %s", logEntry.TimeStamp);
            }
        }
        catch (err) {
            error(err);
        }
    });
    reader.on("end", () => {
        success(results);
    });
}
//# sourceMappingURL=fileParser.js.map