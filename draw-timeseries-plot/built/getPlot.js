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
const fs = require("fs");
let moment = require("moment");
let plotly = require("plotly");
let fileType = require("file-type");
function getPlot(logEntries) {
    return __awaiter(this, void 0, void 0, function* () {
        let plotData = new Array();
        logEntries.forEach((v, k, m) => {
            let times = new Array();
            let scores = new Array();
            v.Scores.forEach((score, scoreIndex) => {
                times.push(score.getMomentTimestamp());
                scores.push(score.getValue());
            });
            plotData.push({
                x: times,
                y: scores,
                type: "scatter"
            });
        });
        return yield getPlotlyImage(plotData);
    });
}
exports.getPlot = getPlot;
function getPlotlyImage(plotData) {
    return __awaiter(this, void 0, void 0, function* () {
        let plotly_user = process.env.PLOTLY_USER;
        let plotly_key = process.env.PLOTLY_API_KEY;
        let graphOptions = { filename: "graph-" + moment().unix(), fileopt: "overwrite" };
        let plotlyClient = plotly(plotly_user, plotly_key);
        return new Promise((resolve, reject) => {
            plotlyClient.getImage({ data: plotData }, { format: "png" }, function (err, imageStream) {
                if (err) {
                    reject(err);
                }
                else {
                    let fileName = "/tmp/" + graphOptions.filename + ".png";
                    let fileStream = fs.createWriteStream(fileName);
                    imageStream.pipe(fileStream);
                    fileStream.on("finish", function () {
                        resolve(fs.readFileSync(fileName));
                    });
                }
            });
        });
    });
}
//# sourceMappingURL=getPlot.js.map