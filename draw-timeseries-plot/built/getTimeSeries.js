"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function getTimeSeries(startTime, endTime, bandSize) {
    let today = moment().format("YYYY-MM-DD");
    let start = moment(today + "T" + startTime).subtract(bandSize, "minutes");
    let end = moment(today + "T" + endTime).add(bandSize, "minutes");
    let current = start;
    let result = [];
    while (current <= end) {
        let timestamp = current.add(bandSize, "minutes");
        result.push(timestamp.format());
        current = timestamp;
    }
    return result;
}
exports.getTimeSeries = getTimeSeries;
//# sourceMappingURL=getTimeSeries.js.map