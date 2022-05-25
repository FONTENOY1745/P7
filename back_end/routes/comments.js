const express = require("express");
const auth = require("../middleware/auth");
const commentCtrl = require("../controllers/comments");
const router = express.Router();

// Route pour le traitement des différents cas concernant les commentaires :

router.get("/", auth, commentCtrl.getAllComments);

router.get("/ofpost/:id", auth, commentCtrl.getCommentsForOnePost);

router.delete("/:id", auth, commentCtrl.deleteComment);

router.delete("/ofpost/:id", auth, commentCtrl.deleteCommentsForOnePost);

router.post("/:postId", auth, commentCtrl.createComment);

router.delete("/:id", auth, commentCtrl.deleteComment);

module.exports = router;
