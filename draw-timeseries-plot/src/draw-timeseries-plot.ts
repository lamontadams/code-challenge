import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { getTimeSeries } from "./getTimeSeries";

//no ts types for plotly... :(
let plotly = require("plotly");

const execute: Handler = async (rawEvent: any, context : Context, callback: Callback) =>
{
    try {

        console.log("Handling event %j", rawEvent);

        let plotly_user = process.env.PLOTLY_USER;
        let plotly_key = process.env.PLOTLY_API_KEY;
        let bandSize = parseInt(process.env.TIME_BAND_SIZE || "10");

        let series = getTimeSeries("16:48:01", "19:06:07", bandSize);
        
        let plotData = [
            {
                x: getTimeSeries("16:05:01", "16:55:08", 5),
                y: [96.6, 89.5, 80.1, 96, 77.2, 97.5, 76.8, 77.9, 91.2, 95.8],
                type:"scatter"
            },
            {
                x: getTimeSeries("16:03:01", "16:53:08", 5),
                y: [86.6, 79.5, 90.1, 86, 87.2, 87.5, 66.8, 97.9, 81.2, 85.8],
                type:"scatter"
            }
        ];
        var graphOptions = {filename:"graph", fileopt:"overwrite"};
        await plotly(plotly_user, plotly_key).plot(plotData, graphOptions, function(err:any, msg:any) {
            console.log("Plotly response: %j", msg);
            if(err)
            {
                throw err;
            }
            callback();
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