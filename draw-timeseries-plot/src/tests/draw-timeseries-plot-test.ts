import { execute } from "../draw-timeseries-plot";
import fs = require("fs");
import { S3CreateEvent } from "aws-lambda";

let buffer = fs.readFileSync("./sample-s3-event.json");
let event = <S3CreateEvent> JSON.parse(buffer.toString());

execute(event, null, function(){
    console.log("done");
})