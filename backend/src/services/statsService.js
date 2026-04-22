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
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const thirtyDayStart = new Date(todayStart);
    thirtyDayStart.setDate(thirtyDayStart.getDate() - 29);
    const result = await ClickEvent.aggregate([
        {    
            $match: {    //match all the click events with this linkId and having date more then 30 days ago
                linkId: toObjectId(linkId),
                timestamp: { $gte: thirtyDayStart }
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
            $sort: { _id: -1 }  // sort by latest date first
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                count: 1
            }
        }
    ]);

    // fill missing dates with zero count so graph can show continuous daily points
    const countsByDate = new Map(result.map((entry) => [entry.date, entry.count]));
    const filledSeries = [];

    const currentDate = new Date(thirtyDayStart);
    const endDate = new Date(todayStart);

    while (currentDate <= endDate) {
        const formattedDate = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
        }).format(currentDate);

        filledSeries.push({
            date: formattedDate,
            count: countsByDate.get(formattedDate) || 0,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledSeries;
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
    const dayStart = new Date(now.setHours(0, 0, 0, 0));

    // Build two non-overlapping 3-day windows:
    // recent3: [recent3Start, recent3End)
    // prev3:   [prev3Start, recent3Start)
    const recent3End = new Date(dayStart);
    recent3End.setDate(recent3End.getDate() + 1); // exclusive upper bound (start of tomorrow)

    const recent3Start = new Date(dayStart);
    recent3Start.setDate(recent3Start.getDate() - 2); // today + previous 2 days

    const prev3Start = new Date(recent3Start);
    prev3Start.setDate(prev3Start.getDate() - 3);

    const result = await ClickEvent.aggregate([
        {
            $match: {
                linkId: toObjectId(linkId),
                timestamp: { $gte: prev3Start, $lt: recent3End }
            }
        },
        {
            $project: {
                period: {
                    $cond: [
                        { $gte: ["$timestamp", recent3Start] },
                        "recent3",
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

    let recent3 = 0, prev3 = 0;

    result.forEach(d => {
        if (d._id === "recent3"){
            recent3 = d.count;
        }
        if (d._id === "prev3"){
            prev3 = d.count;
        }
    });

    if (recent3 > prev3) {
        return "up";
    }
    if (recent3 < prev3) {
        return "down";
    }
    return "flat";
};

// Get device analytics breakdown
const getDeviceAnalytics = async (linkId) => {
    const result = await ClickEvent.aggregate([
        {
            $match: {
                linkId: toObjectId(linkId)
            }
        },
        {
            $group: {
                _id: "$device",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $project: {
                _id: 0,
                device: { $ifNull: ["$_id", "unknown"] },
                count: 1
            }
        }
    ]);

    return result;
};

// Get referrer analytics breakdown
const getReferrerAnalytics = async (linkId) => {
    const result = await ClickEvent.aggregate([
        {
            $match: {
                linkId: toObjectId(linkId)
            }
        },
        {
            $group: {
                _id: "$referrer",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 10  // Top 10 referrers
        },
        {
            $project: {
                _id: 0,
                referrer: { $ifNull: ["$_id", "direct"] },
                count: 1
            }
        }
    ]);

    return result;
};

// Detect if link is stale (inactive for more than 7 days)
const getStaleStatus = async (linkId) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const lastClick = await ClickEvent.findOne({
        linkId: toObjectId(linkId)
    }).sort({ timestamp: -1 }).lean();

    if (!lastClick) {
        return { isStale: true, lastClickDate: null, daysInactive: null };
    }

    const lastClickDate = new Date(lastClick.timestamp);
    const isStale = lastClickDate < sevenDaysAgo;
    
    const daysInactive = Math.floor((new Date() - lastClickDate) / (1000 * 60 * 60 * 24));

    return {
        isStale,
        lastClickDate: lastClickDate.toLocaleDateString("en-IN"),
        daysInactive
    };
};

// Detect spike (if today's clicks are 3x the daily average AND >= 10 clicks)
const getSpikeDetection = async (linkId, thirtyDaysAverage) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const result = await ClickEvent.aggregate([
        {
            $match: {
                linkId: toObjectId(linkId),
                timestamp: { $gte: todayStart, $lt: todayEnd }
            }
        },
        {
            $count: "todayClicks"
        }
    ]);

    const todayClicks = result[0]?.todayClicks || 0;
    const spikeThreshold = thirtyDaysAverage * 3;
    const minThreshold = 10;
    const hasSpike = todayClicks > spikeThreshold && todayClicks >= minThreshold;

    return {
        hasSpike,
        todayClicks,
        threshold: Number(spikeThreshold.toFixed(2)),
        spikePercentage: thirtyDaysAverage > 0 ? Number(((todayClicks / thirtyDaysAverage - 1) * 100).toFixed(0)) : 0
    };
};

export { getTotalClicks, getClicksPerDay, getPeakHour, getTrend, getDeviceAnalytics, getReferrerAnalytics, getStaleStatus, getSpikeDetection };