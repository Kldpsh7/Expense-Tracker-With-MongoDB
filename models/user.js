const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isPrime:{
        type:Boolean,
        required:true
    },
    totalExpenses:{
        type:Number
    }
})

module.exports = mongoose.model('User',userSchema);







// const Sequelize = require('sequelize');
// const sequelize = require('../database/db');

// const Users = sequelize.define('user',{
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         primaryKey:true
//     },
//     name:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     password:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     isPrime:Sequelize.BOOLEAN,
//     totalExpenses:{
//         type:Sequelize.INTEGER,
//         default:0
//     }
// })

// module.exports = Users;