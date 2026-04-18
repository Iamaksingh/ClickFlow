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
	}
}, { timestamps: true } );

export default mongoose.model("Link", linkSchema);  //exporting the model to be used in other parts of the application