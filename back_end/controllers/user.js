const db = require('../models/index');

// Comment importer le module de chiffrage bcrypt :

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Comment rechercher un utilisateur :
exports.getOneUser = (req, res) => {
  db.sequelize.models.User.findAll({
    attributes: { exclude: ['password'] },
    where: { id: req.params.id },
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json({ error }));
};

// Comment supprimer un utilisateur :
exports.deleteUser = (req, res) => {
  db.sequelize.models.User.findAll({
    where: { id: req.params.id },
  })
    .then(() => {
      db.sequelize.models.User.destroy({ where: { id: req.params.id } });
    })
    .then(() =>
      res.status(200).json({ message: 'Cet utilisateur est supprimé!' })
    )
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

// Comment récuperer les 4 derniers nouveaux utilisateurs :
exports.getLastSignup = (req, res) => {
  db.sequelize.models.User.findAll({
    attributes: { exclude: ['password'] },
    limit: 4,
    order: [['createdAt', 'DESC']],
  })
    .then((users) => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch((error) => res.status(400).json({ error }));
};

// Comment enregistrer un nouvel utilisateur :
exports.signup = async (req, res, next) => {
  db.sequelize.models.User.findAll({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user.length) {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          db.sequelize.models.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            moderator: req.body.moderator,
          })
            .then(() => res.status(201).json({ message: user }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  db.sequelize.models.User.findAll({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user[0]) {
        return res
          .status(401)
          .json({ error: 'Requête invalide : Utilisateur inconnu!' });
      }
      bcrypt
        .compare(req.body.password, user[0].password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message:
                'Requête invalide : Mot de passe erroné!' +
                console.log(req.body.password + '    ' + user.password),
            });
          }
          res.status(200).json({
            moderator: user[0].moderator,
            userId: user[0].id,
            message: 'Utilisateur reconnu!',
            token: jwt.sign(
              { userId: user.id, moderator: user.moderator },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
