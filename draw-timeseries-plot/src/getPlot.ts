import { PairedLogEntries } from "./fileParser";
import fetch from "node-fetch";
import fs = require("fs");
import { PassThrough }  from "stream";

let moment = require("moment");

//no ts types for plotly... :(
let plotly = require("plotly");
//ts for file-type looks janked - nothing to import.
let fileType = require("file-type");

async function getPlot(logEntries: Map<string, PairedLogEntries>): Promise<Buffer>
{

    let plotData = new Array<any>();
    logEntries.forEach((v, k, m) => {
        //there's probably a way to abuse map to do this, but it's escaped me.
        let times = new Array<string>();
        let scores = new Array<number>();
        v.Scores.forEach((score, scoreIndex) => {
            times.push(score.getMomentTimestamp());
            scores.push(<number>score.getValue());
        });
        
        plotData.push( {
            x: times,
            y: scores,
            type:"scatter"
        });
    });
    
    return await getPlotlyImage(plotData);

}

async function getPlotlyImage(plotData: Array<any>): Promise<Buffer>
{
    let plotly_user = process.env.PLOTLY_USER;
    let plotly_key = process.env.PLOTLY_API_KEY;
    let graphOptions = { filename:"graph-" + moment().unix(), fileopt:"overwrite" };
    let plotlyClient = plotly(plotly_user, plotly_key);

    return new Promise<Buffer>((resolve, reject) =>
    {
        plotlyClient.getImage({ data : plotData }, { format: "png" }, function(err: any, imageStream: any)
        {
            if(err)
            {
                reject(err);
            }
            else {
                //this is probably sub-optimal, but let's write the image out to a temp file
                //then read it back in as a buffer. that's less code thatn stream => buffer shennanigans.
                let fileName = "/tmp/" + graphOptions.filename + ".png";
                
                let fileStream = fs.createWriteStream(fileName);
                imageStream.pipe(fileStream)
                
                fileStream.on("finish", function() {
                    resolve(fs.readFileSync(fileName));
                })
                
                
            }
        });
        
    });
}

export { getPlot }