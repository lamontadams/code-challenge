import {LogEntry, EntryType, getLogEntry} from "./logEntry"
import {Stream} from "stream";
import LineByLineReader = require("line-by-line");
import { Callback } from "aws-lambda";
import util = require("util");

async function parseFile(buffer: Buffer) : Promise<Map<string, PairedLogEntries>>{
    //https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
    //but it turns out typescript apparently doesn't support async iterators properly 
    //(code works but ugly <any> casts everywhere) so we'll node this and use someone's module...
    
    let stream = new Stream.PassThrough();
    stream.end(buffer);

    let reader = new LineByLineReader(
        <any>stream //module supports reading from a stream but the typescript binding is off, so lets cast to any to make it work.
    );
    
    return new Promise<Map<string, PairedLogEntries>>((resolve, reject) =>
    {
        readFile(reader, resolve, reject);
    });
}

class PairedLogEntries {
    constructor(public VisionData: LogEntry) {
        let self = this;
        self.Scores = new Array<LogEntry>();
    }
    
    public Scores: Array<LogEntry>
}

export { PairedLogEntries, parseFile }

//private function - exists so we can promisify LineByLineReader into an async.
function readFile(reader : LineByLineReader, success: (value?: Map<string, PairedLogEntries>) => void, error: Callback)
{
    //walk through the file from top to bottom.
    //any time we see a line that looks like a video was loaded, hang onto that line and look for a score.
    //if we see another video load before seeing a score, replace the line we're hanging onto with it.
    let results = new Map<string, PairedLogEntries>();
    let lastVisionDataLogEntry: LogEntry = null;
    reader.on("line", (line) =>{
        try {
            let logEntry = getLogEntry(line);
            if(logEntry.getEntryType() === EntryType.Score)
            {
                if(lastVisionDataLogEntry === null)
                {
                    console.error("Line at timestamp %s contains a score with no preceeding VisionData. Raw text: %s", logEntry.TimeStamp, logEntry.Text);
                }
                else
                {
                    console.debug("Matched Score entry at %s with VisionData entry at %s", logEntry.TimeStamp, lastVisionDataLogEntry.TimeStamp);
                    let key = lastVisionDataLogEntry.getValue().toString(); 
                    if(!results.has(key))
                    {
                        results.set(key, new PairedLogEntries(lastVisionDataLogEntry));
                    }
                    results.get(key).Scores.push(logEntry);
                    lastVisionDataLogEntry = null;
                }
            }
            else if(logEntry.getEntryType() == EntryType.VisionData)
            {
                console.debug("Found VisionData entry at %s", logEntry.TimeStamp);
                
                if(!results.has(logEntry.getValue().toString()))
                {
                    results.set(logEntry.getValue().toString(), new PairedLogEntries(logEntry));
                }
                if(lastVisionDataLogEntry !== null)
                {
                    console.debug("Replacing VisionData entry from %s", lastVisionDataLogEntry.TimeStamp);
                }
                lastVisionDataLogEntry = logEntry;
            }
            else
            {
                //pass
                //console.debug("Skipping entry at %s", logEntry.TimeStamp);
            }
        }
        catch(err)
        {
            error(err);
        }
    });
    
    reader.on("end", () => {
        let resultsWithScores = new Map<string, PairedLogEntries>();
        results.forEach((v, k, map) => {
            if(v.Scores.length > 0)
            {
                resultsWithScores.set(k, v);
            }
            else
            {
                console.debug("Omitting VisionData %s because it had no matching scores", k);
            }
        });
        success(resultsWithScores);
    });
}