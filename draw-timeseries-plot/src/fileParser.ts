import {LogEntry, EntryType, getLogEntry} from "./logEntry"
import {Stream} from "stream";
import LineByLineReader = require("line-by-line");
import { Callback } from "aws-lambda";
import util = require("util");

async function parseFile(buffer: Buffer) : Promise<Array<PairedLogEntry>>{
    //https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
    //but it turns out typescript apparently doesn't support async iterators properly 
    //(code works but ugly <any> casts everywhere) so we'll node this and use someone's module...
    
    let stream = new Stream.PassThrough();
    stream.end(buffer);

    let reader = new LineByLineReader(
        <any>stream //module supports reading from a stream but the typescript binding is off, so lets cast to any to make it work.
    );
    
    return new Promise<Array<PairedLogEntry>>((resolve, reject) =>
    {
        readFile(reader, resolve, reject);
    });
}

class PairedLogEntry {
    public VisionData: LogEntry
    public Score: LogEntry
}

export { PairedLogEntry, parseFile }

//private function - exists so we can promisify LineByLineReader into an async.
function readFile(reader : LineByLineReader, success: (value?: PairedLogEntry[]) => void, error: Callback)
{
    //walk through the file from top to bottom.
    //any time we see a line that looks like a video was loaded, hang onto that line and look for a score.
    //if we see another video load before seeing a score, replace the line we're hanging onto with it.
    let results = new Array<PairedLogEntry>();
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
                    console.debug("Matched Score entry at %s with VisionData entry at %s", logEntry.Text, lastVisionDataLogEntry.TimeStamp);
                    results.push({ VisionData: lastVisionDataLogEntry, Score: logEntry });
                    lastVisionDataLogEntry = null;
                }
            }
            else if(logEntry.getEntryType() == EntryType.VisionData)
            {
                console.debug("Found VisionData entry at %s", logEntry.TimeStamp);
                if(lastVisionDataLogEntry !== null)
                {
                    console.debug("Replacing VisionData entry from %s", lastVisionDataLogEntry.TimeStamp);
                }
                lastVisionDataLogEntry = logEntry;
            }
            else
            {
                //pass
                console.debug("Skipping entry at %s", logEntry.TimeStamp);
            }
        }
        catch(err)
        {
            error(err);
        }
    });
    
    reader.on("end", () => {
        success(results);
    });
}