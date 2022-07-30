const db = require('../models')
const User = db.users
const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const emailScramble = require('email-scramble')
const jwt = require('jsonwebtoken')
const fs = require('fs')

// On crée un nouvel utilisateur
exports.signup = (req, res, next) => {
  if (emailValidator.validate(req.body.email)) {
    const encodedEmail = emailScramble.encode(req.body.email)
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = {
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          email: encodedEmail,
          // On récupère le password crypté
          password: hash,
        }
        // On enregistre le nouvel utilisateur dans la base de données
        User.create(user)
          .then(() =>
            res.status(201).json({ message: 'Nouvel utilisateur créé' })
          )
          .catch((error) => res.status(400).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
  } else {
    res.status(400).json({ message: 'Veuillez saisir une adresse mail valide' })
  }
}

exports.login = (req, res, next) => {
  const encodedEmail = emailScramble.encode(req.body.email)
  // On récupère l'adresse mail du nouvel utilisateur
  User.findOne({ where: { email: encodedEmail } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur inconnu' })
      }
      // On vérifie le mot de passe
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Mot de passe invalide' })
          }
          res.status(200).json({
            userId: user.id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.SECRET_KEY,
              {
                expiresIn: '24h',
              }
            ),
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

// On récupère les coordonnées de l'utilisateur
exports.getUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => res.status(200).json(user))
    .catch((error) =>
      res.status(400).json({
        message:
          "Les données de l'utilisateur n'ont pu être récupérées" + error,
      })
    )
}

// On modifie les coordonnées de l'utilisateur
exports.updateUser = (req, res, next) => {
  const user = req.file
    ? {
      ...req.body,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename
        }`,
    }
    : { ...req.body }
  User.update(user, { where: { id: req.params.id } })
    .then(() =>
      res
        .status(200)
        .json({ message: 'Les données utilisateur ont été mises à jour' })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Impossible de mettre à jour le profil' + error })
    )
}

// Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      const filename = user.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        User.destroy({ where: { id: req.params.id } })
          .then(() =>
            res.status(200).json({ message: "Utilisateur supprimé" })
          )
          .catch((error) =>
            res.status(400).json({
              message:
                "Un problème est survenu à la suppression de l'utilisateur" +
                error,
            })
          )
      })
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: 'Erreur au catch du findOne' + error })
    )
}