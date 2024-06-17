import { Schema, model } from "mongoose";

const PostsSchema = new Schema({
    userId:{type:String,required:true},
    desc:{type:String},
    likes:{type:Array},
    images:{type:String}
},{
    timestamps:true
});

export const PostsModel = model("post",PostsSchema);