const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
var cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs= require('fs')
const dotenv = require('dotenv')

const usersignup = require('./router/user.js')
const userexpenses = require('./router/expense.js')
const purchase = require('./router/purchase.js')
const premium = require('./router/premium.js')
const password = require('./router/password.js')

const sequelize = require('./util/database')

const User = require('./model/user_signup.js')
const Expense = require('./model/user_expenses.js')
const Order = require('./model/order.js')
const ForgotPassword = require('./model/ForgotPasswordRequests.js')
const downloadedURL = require('./model/downloadedURL.js')

//app.use(express.static(path.join(__dirname, "js")))
app.use(express.static('js'))

dotenv.config()

const accessLogStream = fs.createWriteStream(path.join(__dirname,'accesslog'),{flags:'a'})

// app.use(helmet())
// app.use(compression())
//app.use(morgan('combined',{stream:accessLogStream}))


app.use(cors())
app.use(bodyParser.json())

app.use(usersignup)
app.use(userexpenses)
app.use(purchase)
app.use(premium)
app.use(password)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)

User.hasMany(downloadedURL)
downloadedURL.belongsTo(User)

sequelize
.sync()
.then(result =>{
    console.log("IT IS APP.JS RESULT")
    //console.log(result)
    app.listen(8000)
})
.catch( err =>{
    console.log("IT IS APP.JS CATCH ERROR")
    console.log(err)
})