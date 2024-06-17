import mongoose from "mongoose";
import { PostsModel } from "../model/PostModel.mjs";
import { UserModel } from "../model/UserModel.mjs";

export class PostsClass{
    static createPosts = async(req,res)=>{
        const newPost = new PostsModel(req.body);
        try {
            await newPost.save()
            res.status(200).json({message:"post created successfully!"});
        } catch (error) {
            res.status(500).json({message:"Internal server error!"});
        }
    }
    static getPosts = async(req,res)=>{
        const id = req.params.id;
        try {
           const post = await PostsModel.findById(id);
            res.status(203).json({"message":"posts getting successfully","post":post});
        } catch (error) {
            res.status(500).json({"message":"Internal server Error"});
            
        }
    }
    static updatePosts = async(req,res)=>{
        
        const id = req.params.id;
        const {userId,desc} = req.body;
        try {
           const post = await PostsModel.findById(id);
           if(post.userId === userId){
                const UpdatedPost = await PostsModel.updateOne({$set:req.body});
               res.status(203).json({"message":"post Updated successfully","post":UpdatedPost});
           }
           else{
            res.status(203).json({"message":"Action Forbidden"});
           }
        } catch (error) {
            res.status(500).json({"message":"Internal server Error"});
            
        }
    }
    static deletePosts = async(req,res)=>{
        
        const id = req.params.id;
        const {userId} = req.body;
        try {
           const post = await PostsModel.findById(id);
           if(post){
                if(post.userId === userId){

                    const DeletedPost = await PostsModel.findByIdAndDelete(id);
                   res.status(203).json({"message":"post deleted successfully"});
                }
                else{
                    res.status(203).json({"message":"Action Forbidden"});   
                }
           }
           
        } catch (error) {
            res.status(500).json({"message":"Internal server Error"});
            
        }
    }
    static likePosts = async(req,res)=>{
        
        const id = req.params.id;
        const {userId} = req.body;
       try {
        const post = await PostsModel.findById(id);
        
        if(post){
            if(!post.likes.includes(userId)){

                const likes = await PostsModel.updateOne({$push:{likes:userId}});
                 res.json({"message":"post liked sucessfully","likes":likes});
            }
           else{
                await PostsModel.updateOne({$pull:{likes:userId}});
                res.json({"message":"post Disliked sucessfully"});
           }

        }
        else{
           res.json({"message":"Action Forbidden"});

        }
       } catch (error) {
         res.json({"message":"Internal Server Error"});
        
       }
    }
    static createPost = async (req, res) => {
        
        const newPost = new PostsModel(req.body);
        try {
            await newPost.save();
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ message: "Error creating post", error: error.message || error });
        }
    }

    static getTimeLinePosts = async (req, res) => {
        const userId = req.params.id;
        try {
            // Fetch current user's posts
            console.log('Fetching posts for user:', userId);
            const currentUserPosts = await PostsModel.find({ userId: new mongoose.Types.ObjectId(userId) });

            console.log('Current user posts:', currentUserPosts);

            // Aggregate to find following users' posts
            const followingPostsData = await UserModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "following",
                        foreignField: "userId",
                        as: "followingPosts"
                    }
                },
                {
                    $project: {
                        followingPosts: 1
                    }
                }
            ]);

            console.log('Following posts data:', ...followingPostsData);

            // Extract following posts from aggregation result
            const followingPosts = followingPostsData.length > 0 ? followingPostsData[0].followingPosts : [];

            // Combine current user posts and following posts
            const allPosts = currentUserPosts.concat(followingPosts);

            console.log('All posts:', allPosts);

            // Send the response
            res.status(200).json(allPosts);
        } catch (error) {
            console.error('Error fetching timeline posts:', error);
            res.status(500).json({ message: "Error fetching timeline posts", error: error.message || error });
        }
    }
}