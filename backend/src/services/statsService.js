import ClickEvent from "../models/ClickEvent.model.js";
import mongoose from "mongoose";

//convert the given string into a mongoose objectId
const toObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
};

// count the total clicks of an ID
const getTotalClicks = async (linkId) => {
    const result = await ClickEvent.aggregate([    // aggregate steps
        {
            $match: {    // 1. match all the click events for this given linkID
                linkId: toObjectId(linkId)
            }
        },
        {  
            $count: "totalClicks"    // 2. aggregate the total no of clickEvents for this particular click ID
        }
    ]);

    return result[0]?.totalClicks || 0;
};



// get the clicks per day for last 30 days 
const getClicksPerDay = async (linkId) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await ClickEvent.aggregate([
        {    
            $match: {    //match all the click events with this linkId and having date more then 30 days ago
                linkId: toObjectId(linkId),
                timestamp: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {    //get the count of each click event and group those all by date
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$timestamp",
                        timezone: "Asia/Kolkata"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }  // sort this data in ascending order 
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                count: 1
            }
        }
    ]);
    return result;
};


// get the peak hour of the day for the given linkId
const getPeakHour = async (linkId) => {
    const result = await ClickEvent.aggregate([
        {
            $match: {   //match all the click events with this linkId
                linkId: toObjectId(linkId)
            }
        },
        {
            $group: {   //group the click events by hour and count the no of click events for each hour
                _id: { $hour: { date: "$timestamp", timezone: "Asia/Kolkata" } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }   //sort in descending order
        },
        {
            $limit: 1  //show only the top most 
        }
    ]);

    return result[0]?._id ?? 0;
};


//get trend information
const getTrend = async (linkId) => {
    const now = new Date();

    // Normalize to midnight today
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    // Last 3 days (today + 2 before)
    const last3Start = new Date(todayStart);
    last3Start.setDate(last3Start.getDate() - 3);

    // Previous 3 days
    const prev3Start = new Date(todayStart);
    prev3Start.setDate(prev3Start.getDate() - 6);

    const result = await ClickEvent.aggregate([
        {
            $match: {
                linkId: toObjectId(linkId),
                timestamp: { $gte: prev3Start }
            }
        },
        {
            $project: {
                period: {
                    $cond: [
                        { $gte: ["$timestamp", last3Start] },
                        "last3",
                        "prev3"
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$period",
                count: { $sum: 1 }
            }
        }
    ]);

    let last3 = 0, prev3 = 0;

    result.forEach(d => {
        if (d._id === "last3"){
            last3 = d.count;
        }
        if (d._id === "prev3"){
            prev3 = d.count;
        }
    });

    if (last3 > prev3) {
        return "up";
    }
    if (last3 < prev3) {
        return "down";
    }
    return "flat";
};


export { getTotalClicks, getClicksPerDay, getPeakHour, getTrend };