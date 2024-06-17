import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    isAdmin:{type:Boolean,required:false},
    profile:{type:String},
    workAt:{type:String},
    relationship:{type:String},
    followers:{type:Array},
    following:{type:Array},
    
},{Timestamp:true});



export const UserModel = mongoose.model("Employer",UserSchema);
