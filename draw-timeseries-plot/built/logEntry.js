"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class LogEntry {
    getMomentTimestamp() {
        let self = this;
        let today = moment().format("YYYY-MM-DD");
        return moment(today + "T" + self.TimeStamp.substring(0, 8) + "Z").format();
    }
    getEntryType() {
        let self = this;
        if (self.Text.indexOf(ScoreEntryMarker) === ScoreMarkerIndex) {
            return EntryType.Score;
        }
        else if (self.Text.startsWith(VisionDataEntryMarker)) {
            return EntryType.VisionData;
        }
        return EntryType.Other;
    }
    getValue() {
        let self = this;
        switch (self.getEntryType()) {
            case EntryType.Score:
                return self.getScoreValue();
            case EntryType.VisionData:
                return self.getVisionDataValue();
            default:
                return null;
        }
    }
    getVisionDataValue() {
        let self = this;
        return self.Text.substring(VisionDataEntryMarker.length);
    }
    getScoreValue() {
        let self = this;
        let start = self.Text.indexOf(ScoreEntryMarker) + ScoreEntryMarker.length;
        let end = self.Text.indexOf(",", start);
        let score = self.Text.substring(start, end);
        return parseFloat(score);
    }
}
exports.LogEntry = LogEntry;
var EntryType;
(function (EntryType) {
    EntryType[EntryType["VisionData"] = 0] = "VisionData";
    EntryType[EntryType["Score"] = 1] = "Score";
    EntryType[EntryType["Other"] = 2] = "Other";
})(EntryType || (EntryType = {}));
exports.EntryType = EntryType;
const TimeStampEnd = 12;
const LogDataStart = 13;
const ScoreMarkerIndex = 56;
const ScoreEntryMarker = "Score: ";
const VisionDataEntryMarker = "###GetVisData():VideoFile is : ";
function getLogEntry(line) {
    let entry = new LogEntry();
    entry.TimeStamp = line.substring(0, TimeStampEnd);
    entry.Text = line.substring(LogDataStart);
    return entry;
}
exports.getLogEntry = getLogEntry;
function getScoreTitle(logEntry) {
    return logEntry.getValue().toString();
}
exports.getScoreTitle = getScoreTitle;
//# sourceMappingURL=logEntry.js.map