import moment = require("moment");

function getTimeSeries(startTime: string, endTime: string, bandSize: number) : Array<string> {
    //given a start and end time, generate a series of times bandSize minutes apart
    //such that the lower boundary < start time and the higher boundary > end time.

    //dates are such a mess in javascript - this all feels like a big hack...

    //the actual is unimportant, so let's assume today so we have something to hang our times off of
    let today = moment().format("YYYY-MM-DD");
    //guarantee we start before the last data point timestamp
    //force an iso format so we don't get deprecation warnings from moment.
    let start = moment(today + "T" + startTime).subtract(bandSize, "minutes");
    //guarantee we end after the last data point timestamp.
    let end = moment(today + "T" + endTime).add(bandSize, "minutes"); 
    let current = start;

    let result = [];
    while(current <= end)
    {
        let timestamp = current.add(bandSize, "minutes");
        result.push(timestamp.format()); //output the time in 05:15 PM format
        current = timestamp;
    }
    return result;
}

export { getTimeSeries }

