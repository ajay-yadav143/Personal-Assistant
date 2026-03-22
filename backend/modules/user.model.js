import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    assistant Name: {
        type: String,
        //trim: true
    },
    assistantImage: {
        //public_id: String,
        type: String
    },
    bio: {
        type: String
    },
    history: [
        {type: string,}
        //default: true
    ]
    
   
}, {timestamp: true})


const user = mongoose.model("User"userSchema)
export default User