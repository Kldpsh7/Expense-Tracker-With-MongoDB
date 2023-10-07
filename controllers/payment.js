const User = require('../models/user');
const Order = require('../models/order');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.getBuyPremium = async (req,res,next)=>{
    try{
        let rzp = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        })
        rzp.orders.create({amount:5000,currency:'INR'}, (err,order)=>{
            if(err){
                console.log(err);
            }
            const newOrder = new Order({orderId:order.id,paymentStatus:'PENDING',userId:req.user._id})
            newOrder.save().then(()=>{
                res.status(200).json({order, key_id:rzp.key_id})
            }).catch(err=>console.log(err))
        })
    }catch(err){
        console.log(err)
    }
}

module.exports.postPaymentDone = async (req,res,next)=>{
    try{
        let order = await Order.findOne({where:{orderId:req.body.order_id}})
        await Order.updateOne({orderId:req.body.order_id},{paymentStatus:'SUCCESS'})
        await User.updateOne({_id:req.user._id},{isPrime:true})
        res.status(200).json({message:'Success',token:jwtCrypt(req.user.email,req.user.name,true)}).end()
    }catch(err){
        console.log(err)
    }
}

module.exports.postPaymentFailed = async (req,res,next)=>{
    console.log('here to update ststus to failed')
    await Order.updateOne({orderId:req.body.order_id},{paymentStatus:'FAILED'})
    res.status(200).end()
}

function jwtCrypt(id,name,prime){
    return jwt.sign({id,name,prime}, process.env.JWT_SECRET)
}