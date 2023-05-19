const express = require('express')
const router = express.Router()
const userController = require('../controllers/usercontroller')
const expenseController = require('../controllers/expensecontroller')
const userauthentication = require('../middleware/auth')

router.get('/user/signup',userController.user_signup)

router.post('/user/signup',userController.post_user_sign_up)

router.get('/user/login',userController.get_user_login)

router.post('/user/login', userController.post_user_login)

router.get('/user/download',userauthentication.authenticate,expenseController.downloadExpenses)



module.exports=router