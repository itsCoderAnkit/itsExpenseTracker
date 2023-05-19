const express = require('express')
const path = require('path')
const User = require('../model/user_signup.js')
const Expense = require('../model/user_expenses.js')
const ForgotPassword = require('../model/ForgotPasswordRequests.js')
const bcrypt = require('bcrypt')

const uuid = require('uuid')

var Sib = require('sib-api-v3-sdk')
var Client = Sib.ApiClient.instance
var apiKey = Client.authentications['api-key'];
apiKey.apiKey = 'copy_paste_from_env_since_procee.env_not_working'

exports.getPassword = async (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'forgotpassword.html'))
}

exports.postPassword = async (req, res, next) => {
    try {
        console.log("password controller post")
        console.log(typeof('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'))
        console.log(process.env.SEND_IN_BLUE_API_KEY)
        
        const email = req.body.email

        const user = await User.findOne({ where: { email: email } })
        //console.log("forgot user>>>", user)

        if (user) {

            var id = uuid.v4()
            // user.createForgotPassword({ id: id, isactive: true })
            const forgot = await ForgotPassword.create({id:id,isactive:true,userId:user.dataValues.id})
           
        }


        const transEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
            email: 'itsankitagarwal000@gmail.com',
            name: 'Ankit'
        }

        const receivers = [{
            email: req.body.email
        }]

        const resp = await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "WE ARE EXPENSE TRACKER",
            textContent: `<a href="http://13.233.19.134:8000/password/resetpassword/${id}">Reset password</a>`,

        })
        console.log(resp)
        res.status(200).json({message:"reset mail sent successfully"})
    }

    catch (err) {
        console.log(err)
    }


}

exports.resetPassword = async (req, res, next) => {
    console.log(req.params.id)
    let id = req.params.id


    const reset = await ForgotPassword.findOne({ where: { id: id } })
    if (reset) {
        reset.update({ isactive: false })
        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
        )

    }
}

exports.updatePassword = async (req, res, next) => {

    try{
        const updatepasswordid = req.params.id
    const newpassword = req.query.newpassword
    console.log("bodypassword",newpassword)
    console.log(req.query.newpassword)

    const forgotPasswordUser = await ForgotPassword.findOne({ where: { id: updatepasswordid } })
    console.log("forgotpassworduser>>>",forgotPasswordUser.userId)
    const forgotUser = await User.findOne({ where: { id: forgotPasswordUser.userId } })
    console.log("forgotuser>>",forgotUser)

    if(forgotUser){
        bcrypt.hash(newpassword, 10, async (err, hash) => {
            console.log("err",err)
            console.log("hash",hash)
            const userDetails = await forgotUser.update({
                password: hash
            })
            res.status(201).json({ message: "password updated successfully" })
            
        })
    }
    }
    catch (err) {
        console.log(err)
    }
}