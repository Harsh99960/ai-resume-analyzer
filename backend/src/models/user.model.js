import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        unique:[true , "username already taken"],
        required:true,
    },

    email:{
        type:String,
        unique:[true , "Account with this Email already exist "],
        required:true,
    },

    password:{
        type:String,
        required:true
    },
})

const userModel = mongoose.model("users" , userSchema);

export default userModel;