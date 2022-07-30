const rateLimit = require('express-rate-limit')

const limitAttempt = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes de délai
    max: 5, // limite chaque IP à 5 requêtes
    message:
        'Nombre maximum de tentatives atteintes : Veuillez recommencer après 60 minutes',
})

module.exports = limitAttempt