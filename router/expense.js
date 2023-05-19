const express = require('express')
const router = express.Router()
const expenseController = require('../controllers/expensecontroller')
const userauthentication = require('../middleware/auth')

router.get('/expense/addexpense', expenseController.get_user_expense)

router.post('/expense/addexpense',userauthentication.authenticate,expenseController.post_user_expense)

router.get('/getAllExpenses',userauthentication.authenticate,expenseController.get_all_expenses)

router.delete('/deleteExpense/:id',userauthentication.authenticate, expenseController.delete_expense)



module.exports=router