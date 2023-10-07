const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    generatedOn:String,
    fileLink:String,
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

module.exports = mongoose.model('Report',reportSchema);



// const Sequelize = require('sequelize');
// const sequelize = require('../database/db');

// const Report = sequelize.define('report', {
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     generatedOn:Sequelize.DATE,
//     fileLink:Sequelize.STRING
// })

// module.exports = Report;