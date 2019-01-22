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
const getTimeSeries_1 = require("./getTimeSeries");
let plotly = require("plotly");
const execute = (rawEvent, context, callback) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log("Handling event %j", rawEvent);
        let plotly_user = process.env.PLOTLY_USER || "lamontadams1";
        let plotly_key = process.env.PLOTLY_API_KEY || "KGa95Z2qXaZbAn7ngzSY";
        let bandSize = parseInt(process.env.TIME_BAND_SIZE || "10");
        let series = getTimeSeries_1.getTimeSeries("16:48:01", "19:06:07", bandSize);
        let plotData = [
            {
                x: getTimeSeries_1.getTimeSeries("16:05:01", "16:55:08", 5),
                y: [96.6, 89.5, 80.1, 96, 77.2, 97.5, 76.8, 77.9, 91.2, 95.8],
                type: "scatter"
            },
            {
                x: getTimeSeries_1.getTimeSeries("16:03:01", "16:53:08", 5),
                y: [86.6, 79.5, 90.1, 86, 87.2, 87.5, 66.8, 97.9, 81.2, 85.8],
                type: "scatter"
            }
        ];
        var graphOptions = { filename: "graph", fileopt: "overwrite" };
        yield plotly(plotly_user, plotly_key).plot(plotData, graphOptions, function (err, msg) {
            console.log("Plotly response: %j", msg);
            if (err) {
                throw err;
            }
            callback();
        });
    }
    catch (error) {
        console.error("Error from handle-github-message: %s", error);
        callback(error, { statusCode: 500 });
        return error;
    }
});
exports.execute = execute;
//# sourceMappingURL=draw-timeseries-plot.js.map