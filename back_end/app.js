const express = require('express')
const cors = require('cors')
const path = require('path')

// Sécurité
require('dotenv').config({ path: './config/.env' })
const helmet = require('helmet')
const xssClean = require('xss-clean')

// Routes
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')

// Express
const app = express()

// On gère les requêtes vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')))

// On sécurise Express avec différentes entêtes HTTP
app.use(helmet())

// On nettoie les entrées des utilisateurs
app.use(xssClean())

// On se connecte à la base de données Sequelize
const db = require('./models')
db.sequelize.sync()

// On crée le middleware contenant les entêtes de réponses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // On accède à l'API de toute origine
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )

  //On ajoute les entêtes aux requêtes vers l'API
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )

  next()
})

// CORS
app.use(cors())

// On transforme le corps de la requête en objet JavaScript utilisable (ce qui remplace le bodyParser)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



// Routes
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)

module.exports = app