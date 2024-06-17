    import { UserModel } from "../model/UserModel.mjs";
    import bcrypt, { hash } from "bcrypt";
    export class UserClass {

        static GetUser = async(req,res)=>{
            const id = req.params.id;

            try {
                const user = await UserModel.findById(id);
                if(user){
                    const {password,...otherDetails} = user._doc;
                    res.status(201).send({message:"User Getting SuccessFully!",otherDetails});  
            }
            } catch (error) {
                await res.status(500).json({message:error.message});
                console.log(error);
            }

        }  
        

        static UpdateUser = async(req,res)=>{
            const id = req.params.id;

            const {cui,currentUserAdminStatus,password} = req.body;
            if(id===cui || currentUserAdminStatus){
                try {
                    if(password){
                        const salt = bcrypt.genSalt(10);
                        req.body.password = await bcrypt.hash(password,hash);
                    }
                    const user = await UserModel.findByIdAndUpdate(id,req.body,{new:true});
                    res.status(202).json(user);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        static DeleteUser = async(req,res)=>{
            const id = req.params.id;
            const {cui,currentUserAdminStatus} = req.body;
            if(id===cui || currentUserAdminStatus){
                try {
                    await UserModel.findByIdAndDelete(id);
                    res.status(202).json("user deleted Successfully!");
                } catch (error) {
                    console.log(error);
                }
            }
        }

        // static FollowUser = async(req,res)=>{
        //     const id = req.params.id;
        //     const {cui} = req.body;
        //     if(id === cui){
        //         try {
        //             res.status(403).json({"message":"Action Forbidden"});

        //         } catch (error) {
        //             console.log("error",error);
        //             res.json(error);
        //         }
               
        //     }
        //     else{
        //         try{

        //             const followUser = await UserModel.findById(id);
        //             const followingUser = await UserModel.findById(cui);

        //             console.log(followUser,"user followed by user1")
        //             console.log(followingUser,"user1 is following user")
                    
        //             if(!followUser.followers.includes(cui)){
        //                 await followUser.updateOne({$push : {followers: cui}});
        //                 await followingUser.updateOne({$push : {following: id}})
                       
        //              res.status(200).json({message:"user Followed successFully!"});
        //             }
        //             else{
        //                 res.status(403).json({message:"user Already Followed"});
        //             }
        //         }
        //         catch (error){
        //             res.status(500).json(error);
        //         }
        //     }
            
        // }

        static FollowUser = async (req, res) => {
        
        // this is My Id (it will store at who followed me on Following! )
        const id = req.params.id;
        
        
        // who wants to follow Me!
        const { cui } = req.body;
        // this cui will be stored at my Followers!
        console.log(cui);

        if (id === cui) {
            return res.status(403).json({ "message": "Action Forbidden" });
        } else {
            try {
                const followUser = await UserModel.findById(id);
                const followingUser = await UserModel.findById(cui);

                if (!followUser.followers.includes(cui)) {
                    await followUser.updateOne({ $push: { followers: cui } });
                    await followingUser.updateOne({ $push: { following: id } });

                    return res.status(200).json({ message: "User followed successfully!" });
                } else {
                    return res.status(403).json({ message: "User already followed" });
                }
            } catch (error) {
                console.error("Error: ", error);
                return res.status(500).json({ message: error.message });
            }
        }
    }
    static UnFollowUser = async (req, res) => {
        const id = req.params.id;
        const { cui } = req.body;
        console.log(cui);

        if (id === cui) {
            return res.status(403).json({ "message": "Action Forbidden" });
        } else {
            try {
                const followUser = await UserModel.findById(id);
                const followingUser = await UserModel.findById(cui);

                if(followUser.followers.includes(cui)) {
                    await followUser.updateOne({ $pull: { followers: cui } });
                    await followingUser.updateOne({ $pull: { following: id } });

                    return res.status(200).json({ message: "User Unfollowed successfully!" });
                } else {
                    return res.status(403).json({ message: "User is not followed by you" });
                }
            } catch (error) {
                console.error("Error: ", error);
                return res.status(500).json({ message: error.message });
            }
        }
    }

    }
