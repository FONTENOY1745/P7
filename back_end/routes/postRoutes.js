const express = require('express')
const router = express.Router()
const postCtrl = require('../controllers/postCtrl')
const commentCtrl = require('../controllers/commentCtrl')
const auth = require('../middleware/auth')
const multer = require('../middleware/multerConfig')

router.post('/', auth, multer, postCtrl.createPost)
router.delete('/:id', auth, postCtrl.deletePost)
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost)
router.post('/:id/like', auth, postCtrl.likePost)
router.put('/:id', auth, postCtrl.updatePost)

router.post('/:id/comment', auth, commentCtrl.createComment)
router.get('/:id/comment', auth, commentCtrl.getComments)

module.exports = router