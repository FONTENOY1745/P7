const express = require("express");

// Route concernant le cas des catégories de forums :

const postforumCtrl = require("../controllers/forums");
const router = express.Router();

router.get("/allCategories", postforumCtrl.getAllCategories);

router.get("/allTopicsCat1", postforumCtrl.getAllTopicsCat1);

module.exports = router;
