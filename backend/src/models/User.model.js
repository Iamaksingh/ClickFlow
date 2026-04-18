import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({    //create a user schema 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {  //validate email format using validator library, require_tld ensures that the email has a valid top-level domain
                return validator.isEmail(value, { require_tld: true }); 
            },
            message: "Please enter a valid email"
        }
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8,
        select: false  //don't return password when querying for data
    },
}, { timestamps: true });

//save hashed password 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {    //failcheck in case the password is not changed and user details are modified then we dont hash passworid again
        return ;
    }
    this.password = await bcrypt.hash(this.password, 10); //hash the current password with salt=10
    
});

//password validator
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);   //compare the curr password with the hashed password stored in DB
};

export default mongoose.model("User", userSchema);