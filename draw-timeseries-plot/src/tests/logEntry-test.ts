import {getLogEntry, LogEntry, EntryType} from "../logEntry"

let lines = [
    "16:29:05:704 PROCESS_MSG(lParam: 1) is received",
    "16:29:05:704 Not a newly created file. File name : 4f620c3c-251f4-74a2",
    "16:29:05:704 ###GetVisData():User directory is : C:\\Users\\PCB_LENS_Device",
    "16:29:05:704 ###GetVisData():VideoFile is : 4f620c3c-251f4-74a2",
    "16:29:05:735 Loading VisionData from file C:\\Users\\PCB_LENS_Device\\VIDEO\\4f620c3c-251f4-74a2.VID",
    "16:29:05:735 Loading VisionData from file C:\\Users\\PCB_LENS_Device\\VIDEO\\4f620c3c-251f4-74a2cogP.VID",
    "16:29:05:750 SNAP ON (Camera 2)",
    "16:29:05:797 SNAP DONE - Period: 54.14",
    "16:29:05:813 TRC ON",
    "17:26:05:922 Not a newly created file. File name : 52cc4e57-14795-23cd",
    "17:26:05:922 ###GetVisData():User directory is : C:\\Users\\PCB_LENS_Device",
    "17:26:05:938 ###GetVisData():VideoFile is : 52cc4e57-14795-23cd",
    "17:26:05:969 Loading VisionData from file C:\\Users\\PCB_LENS_Device\\VIDEO\\52cc4e57-14795-23cd.VID",
    "17:26:05:969 Loading VisionData from file C:\\Users\\PCB_LENS_Device\\VIDEO\\52cc4e57-14795-23cdcogP.VID",
    "17:26:06:125 SNAP ON (Camera 1)",
    "17:26:06:219 SNAP DONE - Period: 79.14",
    "17:26:06:219 MAT ON (52cc4e57-14795-23cd)",
    "17:26:06:219 DoPatternMatching()",
    "17:26:06:297 MAT DONE - Period: 70.42",
    "17:26:06:297 Fiducial was found.  At Angle: 0.0000",
    "17:26:06:297 Map: 0, Camera: 1, Center: (492.0, 418.1), Angle: 0.00, Score: 84.1, Pass: 1 ",
    "17:26:06:297 HANDLE: 48957364, Msg: 34816, lParam: 0",
    "17:26:06:297 PROCESS is done",
    "17:26:07:797 PROCESS_MSG(lParam: 1) is received",
    "17:26:07:797 Not a newly created file. File name : 52cc4ead-148ae-3e98",
    "17:26:07:797 ###GetVisData():User directory is : C:\\Users\\PCB_LENS_Device",
    "17:26:07:797 ###GetVisData():VideoFile is : 52cc4ead-148ae-3e98",
    "17:26:07:829 Loading VisionData from file C:\\Users\\PCB_LENS_Device\\VIDEO\\52cc4ead-148ae-3e98.VID",
    "17:26:07:829 Loading VisionData from file C:\\Users\\PCB_LENS_Device\\VIDEO\\52cc4ead-148ae-3e98cogP.VID",
    "17:26:08:000 SNAP ON (Camera 1)",
    "17:26:08:063 SNAP DONE - Period: 63.23",
    "17:26:08:079 MAT ON (52cc4ead-148ae-3e98)",
    "17:26:08:079 DoPatternMatching()",
    "17:26:08:125 MAT DONE - Period: 47.56",
    "17:26:08:125 Fiducial was found.  At Angle: 0.0000",
    "17:26:08:125 Map: 0, Camera: 1, Center: (492.0, 408.9), Angle: 0.00, Score: 86.1, Pass: 1 ",
]


let others = new Array<LogEntry>();
let scores = new Array<LogEntry>();
let visionDatas = new Array<LogEntry>();
let entries = new Array<LogEntry>();

lines.forEach((line) => {
    var entry = getLogEntry(line);
    entries.push(entry);
    if(entry.getEntryType() == EntryType.Score)
    {
        scores.push(entry);
    }
    else if(entry.getEntryType() == EntryType.VisionData)
    {
        visionDatas.push(entry);
    }
    else{
        others.push(entry);
    }
});

console.log("Scores: %s, VisionData: %s", scores.length, visionDatas.length);
if(scores.length > 0)
{
    console.log("Timestamp: %s, EntryType: %s, MomentTimestamp: %s, Score: %s", 
        scores[0].TimeStamp, 
        scores[0].getEntryType(),
        scores[0].getMomentTimestamp(),
        scores[0].getValue());
}
if(visionDatas.length > 0)
{
    console.log("Timestamp: %s, EntryType: %s, MomentTimestamp: %s, VisionData: %s", 
        visionDatas[0].TimeStamp, 
        visionDatas[0].getEntryType(),
        visionDatas[0].getMomentTimestamp(),
        visionDatas[0].getValue());
}

console.log("Done.");