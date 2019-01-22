import { getTimeSeries } from "../getTimeSeries";

let result = getTimeSeries("15:46:01", "19:17:05", 10);
//TODO: write some real tests instead of spitting this out to the console for eyeballing :D
result.forEach((r) => {
    console.log(r);
});

