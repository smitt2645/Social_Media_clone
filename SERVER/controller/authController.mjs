import { UserModel } from "../model/UserModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class AuthClass {
    static auth =  async (req,res)=>{
       await res.send("AuthRoute")
    }
    static Register = async(req,res)=>{
        const {username,password,firstname,lastname} = req.body;
        if(!username || !password || !firstname || !lastname){
           await res.send({message:"User Registered Failed"});
        }
        
          const salt = await bcrypt.genSalt(10);
          const hasPass = await bcrypt.hash(password,salt);
       
            const NewUser = new UserModel({
                username:username,
                password:hasPass,
                firstname:firstname,
                lastname:lastname
            });
           
            const UserExist = await UserModel.findOne({username:username});
            
            if(UserExist){
               return await res.status(401).send({message:"User Already Registered!"});

            };


            try {
               const user = await NewUser.save()
                const token = jwt.sign({username:user.username,id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});

                await res.status(200).send({message:"User Successfully Created!",user:user,token:token});

            } catch (error) {
                await res.status(500).send({message:"User Creation Failed!"});

                console.log(error);
            }
           
        };

    static Login = async(req,res)=>{
        const {username,password} = req.body;

        try {
            const user = await UserModel.findOne({username:username});
            if(user){
               const validate = await bcrypt.compare(password,user.password);
               if(!validate){
                   
                   res.status(401).send({message:"Wrong PassWord!"});
                }
                else{
                    
                    const token =  jwt.sign({username:user.username,id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
                    res.status(201).send({message:"User LoggedIn Successfully!",user:user,token:token});
    
                
               }
                // validate ? res.status(201).send({message:"User exist!",user:user}) : 
                // res.status(400).send({message:"User dose not exist!"});
           }
        } catch (error) {
            await res.status(500).send({message:"Internal server error"});
            console.log(error);
        }

    }   
    static GetUser = async(req,res)=>{
        const id = req.param.id;

        try {
            const user = await UserModel.findOne({id:id});
            if(user){
                res.status(201).send({message:"User exist!",user:user});     
           }
        } catch (error) {
            await res.status(500).send({message:error.message});
            console.log(error);
        }

    }   

}
