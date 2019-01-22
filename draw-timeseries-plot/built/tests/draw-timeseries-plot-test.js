"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draw_timeseries_plot_1 = require("../draw-timeseries-plot");
const fs = require("fs");
let buffer = fs.readFileSync("./sample-s3-event.json");
let event = JSON.parse(buffer.toString());
draw_timeseries_plot_1.execute(event, null, function () {
    console.log("done");
});
//# sourceMappingURL=draw-timeseries-plot-test.js.map