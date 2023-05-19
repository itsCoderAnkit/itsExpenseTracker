const express = require('express')
const router = express.Router()
const expenseController = require('../controllers/expensecontroller')
const userauthentication = require('../middleware/auth')
const passwordController = require('../controllers/passwordcontroller')

router.get('/password/forgotpassword',passwordController.getPassword)
router.post('/password/forgotpassword',passwordController.postPassword)
router.get('/password/resetpassword/:id',passwordController.resetPassword)
router.get('/password/updatepassword/:id',passwordController.updatePassword)


module.exports = router