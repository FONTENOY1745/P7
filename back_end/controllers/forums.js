const db = require("../models");
const { Category, Topic } = db.sequelize.models;
const fs = require("fs");

// Comment récupérer toutes les catégories de forums (topic = sujet de discussion en anglais) :
exports.getAllCategories = (req, res) => {
  Category.findAll()
    .then((categories) => res.status(200).json(categories))
    .catch((error) => res.status(400).json({ error }));
};

// Comment récupérer tous les forums :
exports.getAllTopicsCat1 = (req, res) => {
  Topic.findAll({
    where: { categoryId: "1" },
  })
    .then((topics) => res.status(200).json(topics))
    .catch((error) => res.status(400).json({ error }));
};
