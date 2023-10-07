const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

module.exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
};

module.exports.postSignUp = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.Email) || badReq.includes(req.body.Name) || badReq.includes(req.body.Password)){
        res.status(403).json({message:"Bad Request"}).end();
    }
    else {
        try{
            let user = await User.findOne({email:req.body.Email})        
            if(user){
                res.status(401).json({message:"User with this email already exists"});
            }
            else{
                let hash = await bcrypt.hash(req.body.Password,10);           
                const user = new User({email:req.body.Email, name:req.body.Name, password:hash, totalExpenses:0, isPrime:false});   
                await user.save();      
                res.status(201).json({message:"Success"});               
        }}
        catch(err){
            console.log(err);
        }
    }
};

module.exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'))
};

module.exports.postLogin = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.Email) || badReq.includes(req.body.Password)){
        res.status(403).json({message:"Bad Request"}).end()
    }
    else {
        try{
            let user = await User.findOne({email:req.body.Email})
            if(!user){
                    res.status(404).json({message:"User Not Found"})
            }
            else{
                bcrypt.compare(req.body.Password,user.password,(err,success)=>{
                    if(success){
                        res.status(201).json({message:"Login Successfull",token:jwtCrypt(user.email,user.name,user.isPrime)})
                    }else{
                        res.status(401).json({message:"Incorrect Password"})
                    }
                })       
            }
        }
        catch(err){
            console.log(err)
        }
    }
}

function jwtCrypt(id,name,prime){
    return jwt.sign({id,name,prime},process.env.JWT_SECRET)
}
