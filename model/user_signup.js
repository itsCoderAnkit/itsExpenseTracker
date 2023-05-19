const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const User = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING
    },
    isPremiumUser:{
        type:Sequelize.BOOLEAN
    },
    totalExpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }

})

module.exports = User