const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator()

passwordSchema
    .is()
    .min(8) // Longueur minimum = 8 caractères
    .is()
    .max(50) // Longueur maximum = 50 caractères
    .has()
    .uppercase() // Lettres majuscules obligatoires
    .has()
    .lowercase() // Lettres miniscules obligatoires 
    .has()
    .digits() // Chiffres obligatoires
    .has()
    .not()
    .spaces() // Espaces non autorisés

module.exports = passwordSchema