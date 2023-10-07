const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../database/db');
const S3Services = require('../services/s3services');
const Report = require('../models/reports');
const { report } = require('../routes/user');

module.exports.getExpense = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','expense.html'))
}

module.exports.getData = async (req,res,next)=>{
    let page = parseInt(req.query.page);
    const itemsPerPage = parseInt(req.query.itemsPerPage);
    try{
        var totalItems = await Expense.count({userId:req.user._id})
        let data = await Expense.find({userId:req.user._id}).skip((page-1)*itemsPerPage).limit(itemsPerPage);
        res.status(200).json({
            items:data,
            currentPage:page,
            hasNextPage:itemsPerPage*page<totalItems,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/itemsPerPage)
        }).end();
    }
    catch(err){
        console.log(err)
    }
    
}

module.exports.postData = async (req,res,next)=>{
    let badReq=[null,undefined,''];
    if(badReq.includes(req.body.amount) || badReq.includes(req.body.description) || badReq.includes(req.body.category)){
        res.status(403).json({message:"Bad Request"}).end()
    }else{
        try{
            const expense = new Expense({amount:req.body.amount, description:req.body.description, category:req.body.category,userId:req.user._id});
            await expense.save();
            let total = parseInt(req.user.totalExpenses);
            total+=parseInt(req.body.amount)
            req.user.totalExpenses=total;
            await req.user.save();
            res.status(201).json({message:'Record Added'});
        }catch(err){
            res.status(400).json({message:'Some error occured'});
            console.log(err);
        }
    }
}

module.exports.deleteExpense = async (req,res,next)=>{
    try{
        let userExpense = await Expense.findOne({_id: req.query.id});
        let total = parseInt(req.user.totalExpenses);
        total-=parseInt(userExpense.amount);
        req.user.totalExpenses=total;
        await req.user.save();
        await Expense.findByIdAndDelete(req.query.id);
        res.status(200).json({message:'Deleted Successfully'}).end();
    }catch(err){
        res.status(500).json({message:'Something Wrong'}).end();
        console.log(err);
    }
}

module.exports.getReport = async (req,res,next)=>{
    try{
        const expenses = await Expense.find({userId:req.user._id},{_id:0,amount:1,description:1,category:1});
        const expenseString = JSON.stringify(expenses)
        console.log(expenseString);
        const fileUrl = await S3Services.uploadToS3(expenseString,`expenses_${req.user.email}/${new Date()}.txt`);
        const expenseReport = new Report({generatedOn:new Date(),fileLink:fileUrl,userId:req.user._id});
        await expenseReport.save();
        const pastReports = await Report.find({userId:req.user._id});
        res.status(200).json({fileUrl:fileUrl,message:'success',pastReports:pastReports}).end()
    }
    catch(err){
        console.log(err)
        res.status(500),json({message:'something wrong'}).end()
    }
}