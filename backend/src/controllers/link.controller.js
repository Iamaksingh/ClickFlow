import {nanoid} from 'nanoid';
import Link from '../models/link.model.js';
import ClickEvent from '../models/ClickEvent.model.js';
import ApiResponse from '../utils/apiResponse.js';

//controller function to create a new shortened link. It validates the input, generates a unique short code, saves the link to the database,
//and returns the created link in the response. If any errors occur during the process, it returns an appropriate error response.
const createLink = async (req, res) => {
    try {
        const { originalUrl, name } = req.body;
        if (!originalUrl) {  //if empty url is provided return error response
            return res.status(400).json(ApiResponse.error('A URL is required'));
        }

        // input validation to ensure the provided URL is in a valid format. If the URL is invalid, it returns a 400 error response with an appropriate message.
        let url = originalUrl;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        try {
            new URL(url);
        } catch {
            return res.status(400).json(ApiResponse.error("Invalid URL format"));
        }

        let shortCode;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;
        while (attempts < MAX_ATTEMPTS) {  //generate a unique short code with a maximum number of attempts to avoid infinite loops
            shortCode = nanoid(8);
            const existingLink = await Link.findOne({ shortCode });
            if (!existingLink) {
                break;
            }
            attempts++;
        }
        if (attempts === MAX_ATTEMPTS) {   //if failed ask user to try again after some time.
            return res.status(500).json(ApiResponse.error("Failed to generate unique short code, please try again later"));
        }

        const newLink = new Link({ originalUrl: url, shortCode, userId: req.user._id, name: name || null });  //create new link document and refer it to the user and save to database
        await newLink.save(); 

        const data = {  //create data object to return in response
            _id: newLink._id,
            originalUrl: newLink.originalUrl,
            shortCode: newLink.shortCode,
            name: newLink.name,
            shortUrl: `${req.protocol}://${req.get("host")}/${newLink.shortCode}`
        };
        return res.status(201).json(ApiResponse.success('Link created successfully', data));

    } catch (error) {
        return res.status(500).json(ApiResponse.error('Error creating link', error.message));
    }                         
}


//function to handle redirection when a user accesses a short URL. It looks up the short code in the database, and if found, redirects the user to the original URL.
// If the short code is not found, it returns a 404 error response.
const redirectLink = async (req, res) => {
    try {
        const { shortCode } = req.params;
        //only select what is needed to optimize query performance and return as js onject and not a model instance
        const link = await Link.findOne({ shortCode }).select("_id originalUrl").lean();  

        if (!link) {    //if short code is not found in database return 404 error response
            return res.status(404).json(ApiResponse.error("Not a valid short URL, try again with a different link"));
        }

        // Extract metadata
        const referrer = req.get("referer") || "direct";   //referrer is from where does user came from, use "direct" in case user sends empty or null value.
        const userAgent = req.get("user-agent");
        const device = getDeviceType(userAgent);

        const window = 2 * 60 * 1000;  // 2 minutes window to prevent multiple clicks from same user in short time frame, this is to avoid spamming and get more accurate click data.

        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
        const existing = await ClickEvent.findOne({
            linkId: link._id,
            ip,
            timestamp: { $gte: new Date(Date.now() - window) }
        });
        
        if (!existing) {
            //use non blocking for instant rederect
            ClickEvent.create( { linkId: link._id , referrer, device, ip } ).catch(err => console.error("Click log failed:", err));
        }
        //if short code is found, redirect to the original URL with a 302 status code.
        return res.redirect(302, link.originalUrl);  
   
    } catch (err) {
        return res.status(500).json(ApiResponse.error("Server error", err.message));
    }
};


//get user's link and sort then in descending order of creation date. 
const getUserLinks = async (req, res) => {
    try {
        const links = await Link.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const data = links.map(link => ({
            _id: link._id,
            originalUrl: link.originalUrl,
            shortCode: link.shortCode,
            name: link.name,
            shortUrl: `${req.protocol}://${req.get("host")}/${link.shortCode}`,
            createdAt: link.createdAt
        }));
        return res.json(ApiResponse.success("User links fetched", data));
    } catch (err) {
        return res.status(500).json(ApiResponse.error("Error fetching links"));
    }
};


//delete a link by its id
const deleteLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await Link.findById(id);
        
        if (!link) {
            return res.status(404).json(ApiResponse.error('Link not found'));
        }

        // Verify the link belongs to the authenticated user
        if (link.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json(ApiResponse.error('You can only delete your own links'));
        }

        await Link.findByIdAndDelete(id);
        // Also delete associated click events
        await ClickEvent.deleteMany({ linkId: id });

        return res.json(ApiResponse.success('Link deleted successfully'));
    } catch (err) {
        return res.status(500).json(ApiResponse.error('Error deleting link', err.message));
    }
};


//update link details (like name)
const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const link = await Link.findById(id);
        
        if (!link) {
            return res.status(404).json(ApiResponse.error('Link not found'));
        }

        // Verify the link belongs to the authenticated user
        if (link.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json(ApiResponse.error('You can only update your own links'));
        }

        link.name = name || null;
        await link.save();

        return res.json(ApiResponse.success('Link updated successfully', {
            _id: link._id,
            originalUrl: link.originalUrl,
            shortCode: link.shortCode,
            name: link.name
        }));
    } catch (err) {
        return res.status(500).json(ApiResponse.error('Error updating link', err.message));
    }
};


//helper function to determine the device on which the link was clicked
const getDeviceType = (userAgent) => {
    if (!userAgent) return "desktop";
    userAgent = userAgent.toLowerCase();
    if (userAgent.includes("mobile")){
        return "mobile";
    }
    if (userAgent.includes("tablet")){ 
        return "tablet";
    }
    return "desktop";
};


//export the controller functions to be used in route definitions
export { createLink, redirectLink, getDeviceType , getUserLinks, deleteLink, updateLink};