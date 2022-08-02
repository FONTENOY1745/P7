module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        // Clé primaire de l'identifiant générée par sequelize

        lastName: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: { is: /[a-z\-]{2,20}/i },
        },
        firstName: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: { is: /[a-z\-]{2,20}/i },
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: { isEmail: true },
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: Sequelize.STRING,
            defaultValue: 'Ma photo',
        },
        job: {
            type: Sequelize.STRING(50),
            defaultValue: 'Mon poste',
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    })

    return User
}