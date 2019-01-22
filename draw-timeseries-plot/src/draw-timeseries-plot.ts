import { Handler, Context, Callback, S3CreateEvent } from 'aws-lambda';
import { parseFile } from "./fileParser";
import { S3 } from "aws-sdk";
import { getPlot } from "./getPlot";

const execute: Handler = async (event: S3CreateEvent, context : Context, callback: Callback) =>
{
    try {

        console.log("Handling event %j", event);

        let s3 = new S3({apiVersion:"2006-03-11"});

        event.Records.forEach(async (record) =>  {
            
            //get the file from s3
            let response = await s3.getObject({
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key
            }).promise();
            
            //Body is a union which the compiler still doesn't deal with well, so we need a cast.
            let buffer = await getPlot(await parseFile(<Buffer> response.Body));
            
            //put the buffer back into s3
            await s3.putObject(
                {
                    Bucket: record.s3.bucket.name,
                    Key: record.s3.object.key + ".graph.png",
                    Body: buffer
                }
            ).promise();
            //TODO: post a message somewhere saying the file was done.
        });
        
        
        
    }
    catch(error)
    {
        console.error("Error from handle-github-message: %s", error);
        callback(error, { statusCode: 500 });
        return error;
    }
}



export { execute }