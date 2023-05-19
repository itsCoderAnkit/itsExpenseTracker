
const express = require('express')
const router = express.Router()
const purchaseController = require('../controllers/purchase')
const userauthentication = require('../middleware/auth')
const premiumcontroller = require('../controllers/premium')

router.get('/premium/showLeaderBoard',userauthentication.authenticate,premiumcontroller.getLeaderBoard)


module.exports = router