const express = require('express')
const path = require('path')
const User = require('../model/user_signup.js')
const Expense = require('../model/user_expenses.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.user_signup = async (req, res, next) => {
    try {
        await res.sendFile(path.join(__dirname, "../", "views", "signup.html"))
    }
    catch (err) {
        console.log(err)
        console.log("USER SIGN UP PAGE LOADING FAILED")
    }

}

exports.post_user_sign_up = async (req, res, next) => {
    try {
        const username = req.body.name
        const useremail = req.body.email
        const userpassword = req.body.password


        console.log(" backend ", username)

        if (!useremail || !username || !userpassword) {
            return res.status(500).json({
                error: "USER EMAIL NOT PROVIDED"
            })
            // throw new Error( "USER EMAIL NOT PROVIDED")
            //console.log("USER EMAIL NOT PROVIDED")
        }

        console.log("Existing users")

        const existinguser = await User.findAll({ where: { email: useremail } })


        console.log(existinguser[0])

        if (existinguser[0]) {
            return res.status(500).json({ error: "USER ALREADY EXISTS" })
        }


        bcrypt.hash(userpassword, 10, async (err, hash) => {
            console.log(err)
            console.log(hash)
            const userDetails = await User.create({
                name: username,
                email: useremail,
                password: hash
            })
            res.status(201).json({ userDetails: userDetails })
            console.log(userDetails)
        })

        // const userDetails = await User.create({
        //     name: username,
        //     email: useremail,
        //     password: userpassword
        // })



    }
    catch (err) {
        res.status(500).json({ error: err })

        console.log(" USER SIGNUP DETAILS NOT SAVED IN DATABASE")
    }

}

exports.get_user_login = async (req, res, next) => {
    try {
        await res.sendFile(path.join(__dirname, '../', 'views', 'login.html'))
    }
    catch (err) {
        res.status(500).json({ error: err })

        console.log("UNABLE TO LOAD LOGIN PAGE")
    }

}

function generateAccessToken(id, name,isPremiumUser) {
    return jwt.sign({ userId: id, name: name ,isPremiumUser:isPremiumUser}, process.env.JWT_SECRET_KEY)
}


exports.post_user_login = async (req, res, next) => {
    try {
        const useremail = req.body.email
        const userpassword = req.body.password

        console.log(useremail, userpassword)
        const existinguser = await User.findAll({ where: { email: useremail } })
        console.log(existinguser[0].isPremiumUser)
        if (existinguser[0]) {

            bcrypt.compare(userpassword, existinguser[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Something Went Wrong" })
                }
                if (result === true) {
                    console.log("WELCOME TO EXPENSE TRACKER")
                    
                        return res.status(200).json({ success: true, message: "user logged in successfully", existinguser: existinguser[0],token:generateAccessToken(existinguser[0].id,existinguser[0].name,existinguser[0].isPremiumUser) })  
                }
                else {
                    return res.status(401).json({ success: false, message: "password is wrong", ERROR: "User not authorized" })
                }
            })
            // if (existinguser[0].password == userpassword) {
            //     console.log("WELCOME TO EXPENSE TRACKER")
            //     return res.status(200).json({ existinguser: existinguser[0] })
            // }
            // else {
            //     return res.status(401).json({ ERROR: "User not authorized" })
            // }

        }
        if (!existinguser[0]) {
            return res.status(404).json({ error: "USER NOT FOUND" })
        }

    }
    catch (err) {
        res.status(500).json({ error: err })
        console.log("UNABLE TO VERIFY LOGIN DETAILS")
    }
}

