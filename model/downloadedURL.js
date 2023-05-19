const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const downloadedURL = sequelize.define('downloadedURL',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    URL:{
        type:Sequelize.STRING
    }

})

module.exports = downloadedURL