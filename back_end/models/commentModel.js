module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        // Clé primaire id généré automatiquement par sequelize
        content: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    })

    return Comment
}