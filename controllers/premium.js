const express = require('express')
const path = require('path')
const User = require('../model/user_signup.js')
const Expense = require('../model/user_expenses.js')
const Razorpay = require('razorpay')
const Order = require('../model/order')
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database')


exports.getLeaderBoard = async (req, res, next) => {
    try {
        const leaderBoardOfUsers = await User.findAll({
            // attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],


            // include: [
            //     {
            //         model: Expense,
            //         attributes: []
            //     }

            // ],
            // group: ['users.id'],
            order: [['totalExpenses', 'DESC']]
        })
        // const expenses = await Expense.findAll()
        // const userAggregatedExpenses = {}
        // console.log(expenses)
        // expenses.forEach((expense)=>{

        //     if(userAggregatedExpenses[expense.userId]){
        //         userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount
        //     }
        //     else{
        //         userAggregatedExpenses[expense.userId] = expense.amount
        //     }
        // })

        // console.log(userAggregatedExpenses)
        // var userLeaderBoardDetails = []
        // users.forEach((user)=>{
        //     userLeaderBoardDetails.push({name:user.name, total_cost:userAggregatedExpenses[user.id] || 0})
        // })
        // userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost)
        // console.log(userLeaderBoardDetails)

        res.status(200).json({ gotit: "yes got it", userLeaderBoardDetails: leaderBoardOfUsers })

    }
    catch (err) {
        console.log(err, "it is leaderboard error")
    }

}

