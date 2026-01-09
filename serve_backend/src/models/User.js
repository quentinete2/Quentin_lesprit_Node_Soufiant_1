const { Model } = require('sequelize');

// Modèle User : Représente les utilisateurs du système
const User = (sequelize, DataTypes) => {
    class User extends Model {
        // Définir les associations avec les autres modèles
        static associate(models) {
            // Un utilisateur a un profil
            this.hasOne(models.Profile, {
                foreignKey: 'user_id',
                as: 'profile'
            });

            // Un utilisateur peut créer plusieurs posts
            this.hasMany(models.Post, {
                foreignKey: 'user_id',
                as: 'posts'
            });

            // Un utilisateur peut faire plusieurs commentaires
            this.hasMany(models.PostComment, {
                foreignKey: 'user_id',
                as: 'comments'
            });

            // Un utilisateur peut avoir plusieurs rôles (relation many-to-many)
            this.belongsToMany(models.Role, {
                through: models.UserRole,
                foreignKey: 'user_id',
                otherKey: 'role_id',
                as: 'roles'
            });
        }

        // Méthode pour retourner un utilisateur sans données sensibles (mot de passe, token, timestamps)
        clean() {
            const { password, token, updatedAt, createdAt, ...cleanedUser } = this.dataValues;
            return cleanedUser;
        }
    }

    // Initialiser le modèle avec les attributs
    User.init({
        // Token JWT pour les sessions actives
        token: DataTypes.TEXT,
        // Nom d'utilisateur unique
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        // Email unique pour la connexion et les notifications
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        // Mot de passe hashé
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        // Ajouter les timestamps created_at et updated_at
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Créer des index uniques pour améliorer les performances de recherche
        indexes: [
            {
                unique: true,
                fields: ['username']
            },
            {
                unique: true,
                fields: ['email']
            }
        ]
    });

    return User;
};

module.exports = User;
