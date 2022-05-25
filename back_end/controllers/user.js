const db = require("../database/db");

// Comment importer le module de chiffrage bcrypt :

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    db.query(
      "INSERT INTO user VALUES (DEFAULT, ?, ?)",
      [email, hash],
      function (err, results) {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ message: "Erreur : utilisateur invalide" });
        }

        res.status(201).json({ message: "Utilisateur ajouté avec succès!" });
      }
    );
  });
};

// Comment rechercher tous les utilisateurs :
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM user", function (err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Erreur : requête de recherche des utilisateurs invalide",
      });
    }

    res.status(200).json(results);
  });
};

// Comment rechercher un seul utilisateur :
exports.getOneUser = (req, res) => {
  User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json({ error }));
};

// Comment supprimer un utilisateur :
exports.deleteUser = (req, res) => {
  User.findOne({
    where: { id: req.params.id },
  })
    .then((User) => {
      User.destroy({ id: req.params.id });
    })
    .then(() =>
      res.status(200).json({ message: "Cet utilisateur est supprimé!" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Comment récuperer les 4 derniers nouveaux utilisateurs :
exports.getLastSignup = (req, res) => {
  User.findAll({
    limit: 4,
    order: [["createdAt", "DESC"]],
  })
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

// Comment enregistrer un nouvel utilisateur :
exports.signup = async (req, res, next) => {
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            moderator: req.body.moderator,
          });
          user
            .save()
            .then(() => res.status(201).json({ message: user }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Requête invalide : Utilisateur inconnu!" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message:
                "Requête invalide : Mot de passe erroné!" +
                console.log(req.body.password + "    " + user.password),
            });
          }
          res.status(200).json({
            moderator: user.moderator,
            userId: user.id,
            message: "Utilisateur reconnu!",
            token: jwt.sign(
              { userId: user.id, moderator: user.moderator },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
