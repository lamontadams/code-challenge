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
const fileParser_1 = require("./fileParser");
const aws_sdk_1 = require("aws-sdk");
const getPlot_1 = require("./getPlot");
const execute = (event, context, callback) => __awaiter(this, void 0, void 0, function* () {
    console.log("Handling event %j", event);
    let promises = new Array();
    event.Records.forEach((record) => {
        promises.push(handleFile(record));
    });
    try {
        yield Promise.all(promises);
        callback();
    }
    catch (error) {
        console.error("Exception in draw-timeseries-plot %s", error);
        callback(error);
    }
});
exports.execute = execute;
function handleFile(record) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let s3 = new aws_sdk_1.S3({ apiVersion: "2006-03-11" });
            let getObjectParams = {
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key
            };
            console.debug("s3.getObject %j", getObjectParams);
            let response = yield s3.getObject(getObjectParams).promise();
            let buffer = yield getPlot_1.getPlot(yield fileParser_1.parseFile(response.Body));
            let putObjectParams = {
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key + ".graph.png",
                Body: null
            };
            console.debug("s3.putObject (Body omitted) %j", putObjectParams);
            putObjectParams.Body = buffer;
            yield s3.putObject(putObjectParams).promise();
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=draw-timeseries-plot.js.map