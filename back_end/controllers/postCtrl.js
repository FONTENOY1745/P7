const db = require('../models')
const User = db.users
const Post = db.posts
const Like = db.likes
const fs = require('fs')
const { Op } = require('sequelize')

// On crée une publication
exports.createPost = (req, res, next) => {
  const post = req.file
    ? {
      ...req.body,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename
        }`,
      like: 0,
    }
    : { ...req.body, like: 0 }
  Post.create(post)
    .then(() => res.status(201).json({ message: 'Publication créée' }))
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Impossible de créer la publication' + error })
    )
}

// On supprime une publication
exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.imageUrl != null) {
        const filename = post.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Post.destroy({ where: { id: req.params.id } })
            .then(() =>
              res
                .status(200)
                .json({ message: 'La publication a été supprimée' })
            )
            .catch((error) =>
              res.status(400).json({
                message:
                  'Un problème est apparu à la suppression de la publication' +
                  error,
              })
            )
        })
      } else {
        Post.destroy({ where: { id: req.params.id } })
          .then(() =>
            res.status(200).json({ message: 'La publication a été supprimée' })
          )
          .catch((error) =>
            res.status(400).json({
              message:
                'Un problème est apparu à la suppression de la publication' +
                error,
            })
          )
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: 'il y a une erreur dans le catch du findOne' + error })
    )
}

// On récupère toutes les publications
exports.getAllPosts = (req, res, next) => {
  Post.findAll({ include: User })
    .then((posts) => res.status(200).json(posts))
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Impossible d'afficher les publications" + error })
    )
}

// On récupère une seule publication
exports.getOnePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id }, include: User })
    .then((post) => res.status(200).json(post))
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Impossible d'afficher la publication" + error })
    )
}

// On Like une publication
exports.likePost = (req, res, next) => {
  Like.findOne({
    where: { userId: req.body.userId, postId: req.body.postId },
  }).then((response) => {
    if (!response) {
      Like.create({ ...req.body })
      Post.increment({ like: 1 }, { where: { id: req.body.postId } })
      res
        .status(200)
        .json({ message: 'Le Like est enregistré et le compteur augmenté' })
    } else {
      Like.destroy({
        where: {
          [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }],
        },
      })
      Post.decrement({ like: 1 }, { where: { id: req.body.postId } })
      res.status(200).json({ message: 'Le Like est supprimé et le compteur diminué' })
    }
  })
}

// On modifie une publication
exports.updatePost = (req, res, next) => {
  console.log(req.body)
  Post.update({ content: req.body.content }, { where: { id: req.params.id } })
    .then(() =>
      res.status(200).json({ message: 'La publication a été modifiée' })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Impossible de modifier la publication' + error })
    )
}