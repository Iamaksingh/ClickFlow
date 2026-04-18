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

    return result[0]?._id ?? null;
};


export { getTotalClicks, getClicksPerDay, getPeakHour };