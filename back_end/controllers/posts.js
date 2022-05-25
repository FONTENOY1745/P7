const db = require("../models");
const { Post, Comment } = db.sequelize.models;
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Comment récupérer tous les posts :
exports.getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Comment récupérer les 4 derniers posts :
exports.getLastActivityPost = (req, res) => {
  Post.findAll({
    limit: 4,
  })
    .then((posts) => res.status(201).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Comment saisir un post :
exports.createPost = (req, res, next) => {
  console.log(req.body);
  const postObject = req.body;
  const userId = req.body.userId;
  console.log(userId);
  const userName = req.body.userName;
  if (req.file) {
    postObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  const post = new Post({
    ...postObject,
    userId: userId,
    userName: userName,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "Votre post est enregistré!" }))
    .catch((error) => res.status(400).json({ error }));
};

// Comment modifier un post :
exports.modifyPost = (req, res) => {
  console.log(req.body);
  const postObject = req.body;
  Post.findOne({
    where: { id: req.params.id },
  })
    .then((Post) => {
      Post.update(postObject);
    })
    .then(() => res.status(200).json({ Post }))
    .catch((error) => res.status(400).json({ error }));
};

// Comment annuler un post :
exports.deletePost = (req, res) => {
  Post.findOne({
    where: { id: req.params.id },
  })
    .then((post) => {
      post.destroy({ id: req.params.id });
    })

    .then(() => res.status(200).json({ message: "Ce post est supprimé!" }))
    .catch((error) => res.status(400).json({ error }));
};
