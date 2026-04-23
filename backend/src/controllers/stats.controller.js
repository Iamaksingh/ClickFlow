import { getTotalClicks, getClicksPerDay, getPeakHour, getTrend, getDeviceAnalytics, getReferrerAnalytics, getStaleStatus, getSpikeDetection } from "../services/statsService.js";
import ClickEvent from "../models/ClickEvent.model.js";
import Link from "../models/link.model.js";
import mongoose from "mongoose";
import ApiResponse from '../utils/apiResponse.js';

const getLinkStats = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(ApiResponse.error("Invalid link ID"));
        }

        const objectId = new mongoose.Types.ObjectId(id);
        const linkDoc = await Link.findById(objectId).select("name originalUrl").lean();
        if (!linkDoc) {
            return res.status(404).json(ApiResponse.error("Link not found"));
        }
        const linkName = (linkDoc.name && String(linkDoc.name).trim()) || "Unnamed link";
        
        // Run services parallely to optimize performance
        const [totalClicks, clicksPerDay, peakHour, trend] = await Promise.all([
            getTotalClicks(id),
            getClicksPerDay(id),
            getPeakHour(id),
            getTrend(id)
        ]);
        
        // Daily average (last 30 days) - calculate before spike detection
        const totalLast30Days = clicksPerDay.reduce((sum, day) => sum + day.count, 0);
        const thirtyDaysAverage = clicksPerDay.length ? Number((totalLast30Days / 30).toFixed(2)) : 0;

        // Run remaining services parallely
        const [deviceAnalytics, referrerAnalytics, staleStatus, spikeDetection] = await Promise.all([
            getDeviceAnalytics(id),
            getReferrerAnalytics(id),
            getStaleStatus(id),
            getSpikeDetection(id, thirtyDaysAverage)
        ]);

        // Last accessed (latest click)
        const lastClick = await ClickEvent.findOne({ linkId: objectId }).sort({ timestamp: -1 }).lean();

        const lastAccessed = lastClick?. timestamp ? new Date(lastClick.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : null;

        const analytics = { 
            linkName,
            totalClicks, 
            clicksPerDay, 
            peakHour, 
            lastAccessed, 
            thirtyDaysAverage, 
            trend,
            deviceAnalytics,
            referrerAnalytics,
            staleStatus,
            spikeDetection
        };

        return res.status(200).json(ApiResponse.success("Link analytics fetched successfully", analytics));

    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error("Failed to fetch link analytics"));
    }
};


export { getLinkStats };