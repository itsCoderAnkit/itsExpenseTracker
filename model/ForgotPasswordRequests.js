const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const ForgotPassword = sequelize.define('forgotpassword',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        
        primaryKey:true
    },
    
    isactive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    expiresBy:{
        type:Sequelize.DATE
    }
    

})

module.exports = ForgotPassword