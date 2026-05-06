const express = require('express');
const router = express.Router();
const { processTransaction, getTransactions } = require('../controllers/transactionController');

router.post('/parse', processTransaction);
router.get('/', getTransactions);


module.exports = router;
