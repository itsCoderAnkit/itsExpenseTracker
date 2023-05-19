const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const Order = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    paymentid:{
        type:Sequelize.STRING
    },
    orderid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING
    }
})

module.exports = Order