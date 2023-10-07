const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passwordResetRequestSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})


module.exports = mongoose.model('PasswordResetRequest',passwordResetRequestSchema);







// const Sequelize = require('sequelize');
// const sequelize = require('../database/db');

// const PasswordResetRequest = sequelize.define('passwordResetRequest',{
//     id:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         primaryKey:true,
//     },
//     active:{
//         type:Sequelize.BOOLEAN,
//         default:true
//     }
// })

// module.exports = PasswordResetRequest;