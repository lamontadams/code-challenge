import { Handler, Context, Callback, S3CreateEvent, S3EventRecord } from 'aws-lambda';
import { parseFile } from "./fileParser";
import { S3 } from "aws-sdk";
import { getPlot } from "./getPlot";

const execute: Handler = async (event: S3CreateEvent, context : Context, callback: Callback) =>
{
    console.log("Handling event %j", event);

    
    let promises = new Array<any>();

    event.Records.forEach((record) =>  {
        promises.push(handleFile(record));
    });

    try {
        await Promise.all(promises);
        callback();
    }
    catch(error)
    {
        console.error("Exception in draw-timeseries-plot %s", error);
        callback(error);
    }
    
}

async function handleFile(record: S3EventRecord)
{
    try {
        let s3 = new S3({apiVersion:"2006-03-11"});

        let getObjectParams = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        };
        console.debug("s3.getObject %j", getObjectParams);
        //get the file from s3
        let response = await s3.getObject(getObjectParams).promise();
        
        //Body is a union type, so we help the compiler out with a cast.
        let buffer = await getPlot(await parseFile(<Buffer> response.Body));
        
        let putObjectParams = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key + ".graph.png",
            Body: <any> null
        };
        console.debug("s3.putObject (Body omitted) %j", putObjectParams);
        putObjectParams.Body = buffer;
        //put the buffer back into s3
        await s3.putObject(
            putObjectParams
        ).promise();
        
        //TODO: post a message somewhere saying the file was done.
    }
    catch(error)
    {
        //console.error("Error processing S3 record %s", error);
        throw error;
    }
}

export { execute }