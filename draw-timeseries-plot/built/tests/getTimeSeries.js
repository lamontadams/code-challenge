"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTimeSeries_1 = require("../getTimeSeries");
let result = getTimeSeries_1.getTimeSeries("15:45:01:255", "19:17:05:118", 10);
result.forEach((r) => {
    console.log(r);
});
//# sourceMappingURL=getTimeSeries.js.map