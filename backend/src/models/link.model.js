import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({   //designing a new schema for the link model
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	originalUrl: { 
		type: String, 
		required: true, 
		trim: true 
	},
	shortCode: { 
		type: String, 
		unique: true, 
		index: true 
	},
	name: {
		type: String,
		trim: true,
		default: null
	}
}, { timestamps: true } );

export default mongoose.models.Link || mongoose.model("Link", linkSchema);