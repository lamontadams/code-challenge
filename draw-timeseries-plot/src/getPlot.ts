import { PairedLogEntries } from "./fileParser";
import fs = require("fs");

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
        let labels = new Array<string>();
        v.Scores.forEach((score, scoreIndex) => {
            times.push(score.getMomentTimestamp());
            scores.push(<number>score.getValue());
            labels.push(score.getValue().toString());
        });
        
        plotData.push( {
            x: times,
            y: scores,
            text: labels,
            type:"scatter",
            mode: "lines+markers+text",
            name: v.VisionData.getValue(),
            textposition: "top center"
        });
    });
    
    return await getPlotlyImage(plotData);

}

async function getPlotlyImage(plotData: Array<any>): Promise<Buffer>
{
    //get our plotly config from the environment
    let plotly_user = process.env.PLOTLY_USER;
    let plotly_key = process.env.PLOTLY_API_KEY;
    
    let graphOptions = { filename:"graph-" + moment().unix(), fileopt:"overwrite" };
    let plotlyClient = plotly(plotly_user, plotly_key);

    return new Promise<Buffer>((resolve, reject) =>
    {
        let imageOptions = { 
            format: "png",
            width: 1600, //todo: consider exposing height/width as env values
            height: 700,
        };

        let figure = {
            data: plotData,
            layout: {
                xaxis: {
                    title: "Time"
                },
                yaxis:{
                    title: "Score"
                }
            }
        }
        //the node debugger sometimes doesn't serialize objects logged to console correctly, this is one of those times.
        console.debug("Calling plotlyClient.getImage data: %s, options:%s", JSON.stringify(plotData), JSON.stringify(imageOptions));
        plotlyClient.getImage(figure, imageOptions, function(err: any, imageStream: any)
        {
            if(err)
            {
                console.error("error response from plotly: " + err);
                reject(err);
            }
            else {
                //this is probably sub-optimal, but let's write the image out to a temp file
                //then read it back in as a buffer. that's less code thatn stream => buffer shennanigans.
                let fileName = "/tmp/" + graphOptions.filename + ".png";
                console.debug("Piping response from plotly to %s", fileName);
                let fileStream = fs.createWriteStream(fileName);
                imageStream.pipe(fileStream)
                
                fileStream.on("finish", function() {
                    console.debug("Streaming finished. Reading back as buffer.")
                    resolve(fs.readFileSync(fileName));
                })
                
                
            }
        });
        
    });
}

export { getPlot }