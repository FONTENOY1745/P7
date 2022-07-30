const express = require('express')
const router = express.Router()
const commentCtrl = require('../controllers/commentCtrl')
const auth = require('../middleware/auth')

router.delete('/:id', auth, commentCtrl.deleteComment)

module.exports = router