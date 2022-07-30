const dbConfig = require('../config/db.config.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Liste des tables
db.users = require('./userModel.js')(sequelize, Sequelize)
db.posts = require('./postModel.js')(sequelize, Sequelize)
db.comments = require('./commentModel.js')(sequelize, Sequelize)
db.likes = require('./likeModel.js')(sequelize, Sequelize)

// On associe les tables Users et Posts
db.users.hasMany(db.posts, { onDelete: 'cascade' })
db.posts.belongsTo(db.users)

// On associe les tables Comments et Users et Comments et Posts
db.users.hasMany(db.comments, { onDelete: 'cascade' })
db.comments.belongsTo(db.users)
db.posts.hasMany(db.comments, { onDelete: 'cascade' })
db.comments.belongsTo(db.posts)

// On associe les tables Likes et Users et Likes et Posts
db.users.hasMany(db.likes, { onDelete: 'cascade' })
db.likes.belongsTo(db.users)
db.posts.hasMany(db.likes, { onDelete: 'cascade' })
db.likes.belongsTo(db.posts)

module.exports = db