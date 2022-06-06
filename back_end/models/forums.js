"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate(models) {}
  }
  Topic.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Forums",
    }
  );
  return Topic;
};
