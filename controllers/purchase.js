const express = require('express')
const path = require('path')
const User = require('../model/user_signup.js')
const Expense = require('../model/user_expenses.js')
const Razorpay = require('razorpay')
const Order = require('../model/order')
const jwt = require('jsonwebtoken')


//console.log(process.env.SEND_IN_BLUE_API_KEY)

exports.purchasePremium = async (req, res, next) => {
    try {
        
        var rzp = new Razorpay({
            key_id: process.env.Razorpay_key_id,
            key_secret: process.env.Razorpay_key_secret
        })

        const amount = 250
        console.log(amount)
        rzp.orders.create({ amount: amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch((err) => {
                    throw new Error(err)
                })
                .catch((err) => {
                    console.log(err)
                    res.status(403).json({ message: "SOMETHING WENT WRONG", error: err })
                })
        })
    }
    catch (err) {
        console.log(err)
    }

}

function generateAccessToken(id, name,isPremiumUser) {
    return jwt.sign({ userId: id, name: name ,isPremiumUser:isPremiumUser}, 'secretkey')
}

exports.updateTransactionStatus = async (req, res, next) => {
    console.log("update transaction controllers")
    
    try {
        const { payment_id, order_id } = req.body
        console.log(req.body)
        console.log(order_id)
        
        const order = await Order.findOne({ where: { orderid: order_id } })

        

        const promise1 = order.update({ paymentid: payment_id, status: "SUCCESSFUL" })
        const promise2 =  req.user.update({ isPremiumUser: true })
        Promise.all([promise1, promise2]).then(() => {
        //     const premiumUser = req.user.dataValues
        // console.log("its premium >>>>",premiumUser)
        token = generateAccessToken(req.user.dataValues.id,req.user.dataValues.name,req.user.dataValues.isPremiumUser)
        console.log("token premium",token)    
        return res.status(202).json({ success: true, message: "transaction successfull" ,token:token})
        })
            .catch(err => console.log(err))

        
    }
    catch (err) {
        console.log(err)
    }
}


exports.updateFailedTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body
        console.log(req.body)
        console.log(order_id)
        const order = await Order.findOne({ where: { orderid: order_id } })

        const promise1 = order.update({ paymentid: payment_id, status: "FAILED" })
        const promise2 =  req.user.update({ isPremiumUser: false })
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ success: false, message: "transaction failed" })
        })
            .catch(err => console.log(err))

        
    }
    catch (err) {
        console.log(err)
    }
}

