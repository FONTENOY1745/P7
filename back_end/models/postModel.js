module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {
        // Clé primaire de l'dentifiant générée par Sequelize

        content: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        like: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    })

    return Post
}