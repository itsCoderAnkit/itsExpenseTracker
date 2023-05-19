const express = require('express')
const path = require('path')
const User = require('../model/user_signup.js')
const Expense = require('../model/user_expenses.js')
const bcrypt = require('bcrypt')
const sequelize = require('../util/database.js')
const S3service = require('../services/S3services.js')
const UserServices = require('../services/userservices.js')
const downloadedURL = require('../model/downloadedURL.js')


exports.get_user_expense = async (req, res, next) => {

    try {
        await res.sendFile(path.join(__dirname, '../', 'views', 'userexpenses.html'))
    }
    catch (err) {
        res.status(500).json({ error: err })
        console.log("UNABLE TO LOAD EXPENCE PAGE")
    }
}
exports.post_user_expense = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        console.log("user id got after middleware>>>>> ", req.user.id)
        const amount = req.body.amount
        const description = req.body.description
        const category = req.body.category


        console.log("posted on db", amount, description, category)
        const user_expenses = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        }, { transaction: t })

        //  await t.commit()

        const totalExpenses = Number(req.user.totalExpenses) + Number(amount)
        console.log(totalExpenses)

        await User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t })
        await t.commit()
        res.status(201).json({
            success: true, message: "SAVED DETAILS",
            expenses: user_expenses
        })
    }
    catch (err) {
        await t.rollback()
        console.log("unable to save in database")
        res.status(500).json({ error: err })
    }
}

exports.get_all_expenses = async (req, res, next) => {
    try {
        const listSizeToken = req.header("listSize")
        console.log("listsize>>>",listSizeToken)
        console.log(typeof(+listSizeToken))
        page = +req.query.page || 1
        console.log(page +1 )
        let totalExpenses

        Expense.count()
        .then((total)=>{

            totalExpenses = total
            return Expense.findAll({
                offset: (page-1)*(+listSizeToken),
                limit:(+listSizeToken)
            })
        })
        .then((expenses)=>{
            res.json({
                expenses:expenses,
                currentPage:page,
                hasNextPage:(+listSizeToken)*page<totalExpenses,
                nextPage:page + 1,
                hasPreviousPage:page>1,
                previousPage:page-1,
                lastPage:Math.ceil(totalExpenses/(+listSizeToken))
            })
        })
        .catch((err)=>{console.log(err)})


        // const allExpenses = await Expense.findAll({ where: { userId: req.user.id } })
        // console.log('get all expenses>>>>>>>>', allExpenses)
        // return res.status(200).json({ expenses: allExpenses, success: true })

        //console.log(allExpenses)

        //res.status(200).json({ allExpenses: allExpenses })
    }
    catch (err) {
        res.status(500).json({ error: err, message: "UNABLE TO GET ALL EXPENSES" })
    }
}

exports.delete_expense = async (req, res, next) => {

    try {

        console.log(req.params.id)
        console.log("user delete>>>>", req.user)
        let deleted = await Expense.findAll({ where: { userId: req.user.id, id: req.params.id } })
        console.log("DELETED>>>>", deleted[0].dataValues)

        const totalExpenses = Number(req.user.totalExpenses) - Number(deleted[0].dataValues.amount)
        console.log("totalexpenses>>>>", totalExpenses)

        User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id } })

        Expense.destroy({ where: { userId: req.user.id, id: req.params.id } })
        res.status(200).json({ deleted: deleted })
    }
    catch (err) {
        res.status(500).json({ error: err, message: "unable to delete from db" })
    }
}

exports.downloadExpenses = async (req, res, next) => {
    try {
        const userId = req.user.id
        const expenses = await UserServices.getExpenses(req)
        console.log(expenses)
        const stringifiedExpenses = JSON.stringify(expenses)

        const filename = `Expense${userId}/${new Date()}.txt`

        const fileURL = await S3service.uploadtoS3(stringifiedExpenses, filename)
        console.log(fileURL)
        const URLtable = await downloadedURL.create({
            URL:fileURL,
            userId:req.user.id

        })
        const allURL = await downloadedURL.findAll({where:{userId:req.user.id}})

        //console.log("allURL>>>",allURL)
        res.status(200).json({ fileURL, allURL,success: true })
    }

    catch (err) {
        console.log(err)
    }

}

