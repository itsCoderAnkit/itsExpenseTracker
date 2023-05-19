const express = require('express')
const router = express.Router()
const purchaseController = require('../controllers/purchase')
const userauthentication = require('../middleware/auth')


router.get('/premiumMembership',userauthentication.authenticate,purchaseController.purchasePremium)
router.post('/updateTransactionStatus',userauthentication.authenticate,purchaseController.updateTransactionStatus)
router.post('/updateFailedTransactionStatus',userauthentication.authenticate,purchaseController.updateFailedTransactionStatus)



module.exports = router