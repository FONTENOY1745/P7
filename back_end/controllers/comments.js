const db = require("../models");
const { Comment, Post } = db.sequelize.models;
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Comment récupérer tous les posts :
exports.getAllComments = (req, res) => {
  Comment.findAll()
    .then((comments) => res.status(200).json(comments))
    .catch((error) => res.status(400).json({ error }));
};

// Comment on crée un commentaire :
exports.createComment = (req, res, next) => {
  const CommentObject = req.body;
  // On intercale un console.log pour vérifier les paramètres et le body
  console.log(req.body);
  const postId = req.params.postId;
  const userName = req.body.userName;
  const content = req.body.content;
  const comment = new Comment({
    ...CommentObject,
    postId: postId,
    userName: userName,
    content: content,
  });
  console.log(comment);
  comment
    .save()
    .then(() =>
      res.status(201).json({ message: "Votre commentaire est enregistré!" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Comment on annule un commentaire :
exports.deleteComment = (req, res) => {
  Comment.findOne({
    where: { id: req.params.id },
  })
    .then((Comment) => {
      Comment.destroy({ id: req.params.id });
    })
    .then(() =>
      res.status(200).json({ message: "Votre commentaire est supprimé!" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Comment on annule tous les commentaires :
exports.deleteAllComments = (req, res, next) => {
  Comment.destroy({ where: { postId: req.params.id } })
    .then(() =>
      res.status(200).json({
        message: "Tous les commentaires ont été supprimés!",
      })
    )
    .catch((error) => res.status(400).json({ error }));
  next();
};

// Comment récupérer tous les commentaires pour un post donné :
exports.getCommentsForOnePost = (req, res, next) => {
  Comment.findAll({
    where: { postId: req.params.id },
  }).then(
    function (comment) {
      res.status(200).json(comment);
    },
    function (error) {
      res.status(404).json({ error });
    }
  );
};

// Comment annuler tous les commentaires pour un post donné :
exports.deleteCommentsForOnePost = (req, res, next) => {
  Comment.findAll({
    where: { postId: req.params.id },
  })
    .then(Comment.destroy({ postId: req.params.id }))
    .then(() =>
      res.status(200).json({
        message: "Tous les commentaires ont été supprimés pour ce post!",
      })
    )
    .catch((error) => res.status(400).json({ error }));
};
