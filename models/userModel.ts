import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
import { createValidationSampleTracking } from "next/dist/server/app-render/instant-validation/instant-samples";
import { StagedRenderingController } from "next/dist/server/app-render/staged-rendering";

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:[true,"Please provide first name "]
    },
        Lastname:{
        type:String,
        require:[true,"Please provide Last name "]
    },
        email:{
        type:String,
        require:[true,"Please provide email "],
        unique:true
    },
        password:{
        type:String,
        require:[true,"Please provide password "]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String ,
    verifyTokenExpiry:Date



  


});

const User =mongoose.models.users|| mongoose.model("users", userSchema);

export default User ;