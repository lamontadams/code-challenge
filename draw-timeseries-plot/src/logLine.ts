import moment = require("moment");

class LogEntry {
    TimeStamp: string;
    Text: string;
    
    public getMomentTimestamp():string {
        let self = this;
        //dates are so strange in javascript - this feels very hacky.
        let today = moment().format("YYYY-MM-DD");
        return moment(today + "T" + self.TimeStamp.substring(0, 10) + "Z").format();
    }

    public getEntryType(): EntryType {
        let self = this;
        if(self.Text.startsWith(ScoreEntryMarker)){
            return EntryType.Score;
        }
        else if(self.Text.startsWith(VisionDataEntryMarker))
        {
            return EntryType.VisionData;
        }
        return EntryType.Other;
    }

    public getValue(): string|number {
        let self = this;
        switch(self.getEntryType())
        {
            case EntryType.Score:
                return self.getScoreValue();
            case EntryType.VisionData:
                return self.getVisionDataValue();
            default:
                return null;
        }
    }

    private getVisionDataValue(): string {
        /*given a line that looks like this:
        ###GetVisData():VideoFile is : 4f620a43-24b83-21b9
        return everything to the right of "is :"
        */
        let self = this;
        return self.Text.substring(VisionDataEntryMarker.length);
    }

    private getScoreValue(): number {
        /* given:
        Map: 0, Camera: 1, Center: (492.0, 418.1), Angle: 0.00, Score: 84.1, Pass: 1 
        return the value between 'Score: ' and ','
        */
       let self = this;
       let start = self.Text.indexOf("Score: ");
       let end = self.Text.indexOf(",", start);
       
    }
}

enum EntryType {
    VisionData,
    Score, 
    Other
}

//in real life I'd spend time to work out regex to do replace these.
const TimeStampEnd = 12;
const ScoreEntryMarker = "Score: ";
const VisionDataEntryMarker = "###GetVisData():VideoFile is :";

function getLogEntry(line: string) : LogEntry {
    
    //In real life I'd also do some more robust error checking
    let entry = <LogEntry> {
        TimeStamp: line.substring(0, TimeStampEnd),
        Text: line.substring(TimeStampEnd + 1),

    }
    let timeStamp = line.substring(0, TimeStampEnd);
    let text = line.substring(TimeStampEnd +1);
    if(text.startsWith(ScoreEntryMarker)){

    }
}
export {
    LogEntry,
    EntryType,
    getLogEntry
}