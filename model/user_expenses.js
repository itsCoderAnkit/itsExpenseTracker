const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const Expense = sequelize.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:Sequelize.INTEGER
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    category:{
        type:Sequelize.STRING
    }
})

module.exports = Expense