const express=require("express")
const mongoose=require("mongoose")
const {usermodel}=require("../models/usermodel")
const linkuser=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")



linkuser.post("/register",async(req,res)=>{

    try {
        const payload=req.body
        const user= await usermodel.findOne({email:payload.email})
        if(user){
            return res.send({'msg':"User already exist, please login"})
        }else{
            const hashpassword=await bcrypt.hashSync(payload.password,8)
            payload.password=hashpassword
            const newuser=new usermodel(payload)
            await newuser.save()
            return res.status(200).json({msg:"User register successfull",user:payload})
        }
    } catch (error) {
        res.status(400).send({"msg":"failed"})
    }



})

linkuser.post("/login",async(req,res)=>{
    try {
        const payload=req.body
        const user=await usermodel.findOne({email:payload.email})
        if(!user)  return res.send({"msg":"please signup first"})
           const psswordcorrect=await bcrypt.compareSync(payload.password,user.password)
           if(psswordcorrect){
            const token=await jwt.sign({email:user.email,userid:user._id},"masai")
            res.status(200).json({msg:"login success",token})
           }
        else{
            res.status(400).json({msg:"invalid credentials"})
        }

}
     catch (error) {
        console.log(error)
    }
})








module.exports={linkuser}