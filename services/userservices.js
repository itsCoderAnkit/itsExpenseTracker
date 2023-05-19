const Expense = require('../model/user_expenses.js')

const getExpenses = (req,where) =>{
    return  Expense.findAll({ where: { userId: req.user.id } })
} 


module.exports = {
    getExpenses
}