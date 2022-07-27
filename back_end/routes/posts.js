const express = require("express");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const postCtrl = require("../controllers/posts");
const commentCtrl = require("../controllers/comments");
const router = express.Router();

// Routes concernant le traitement des différents cas de posts :

router.get("/", auth, postCtrl.getAllPosts);

router.get("/:id", auth, postCtrl.getOnePost);

router.get("/lastactivitypost", auth, postCtrl.getLastActivityPost);

router.put("/:id", auth, multer, postCtrl.modifyPost);

router.post("/", auth, multer, postCtrl.createPost);

router.post("/reaction", auth, postCtrl.postReaction);

router.post("/comment", auth, postCtrl.postComment);

router.delete("/:id", auth, commentCtrl.deleteAllComments, postCtrl.deletePost);

router.delete("/comment/:id", auth, postCtrl.deleteComment);

router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;
