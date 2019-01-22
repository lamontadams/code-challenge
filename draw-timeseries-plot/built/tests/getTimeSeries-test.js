"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTimeSeries_1 = require("../getTimeSeries");
let result = getTimeSeries_1.getTimeSeries("15:46:01", "19:17:05", 10);
result.forEach((r) => {
    console.log(r);
});
//# sourceMappingURL=getTimeSeries-test.js.map