const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../config/.env' })

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    const userId = decodedToken.userId
    // Si le userId à la requête est différent de celui du token alors (if/then) identifiant utilisateur invalide. Si non alors on appelle la commande next()
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Identifiant utilisateur invalide'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée' + error })
  }
}