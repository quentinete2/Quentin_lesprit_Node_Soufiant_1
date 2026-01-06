const { Model, DataTypes } = require('sequelize');

// Modèle User représentant les utilisateurs de l'application
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // Définition des associations avec d'autres modèles
    User.associate = (models) => {
        // Un utilisateur a un profil
        User.hasOne(models.Profile, {
            foreignKey: 'user_id',
            as: 'profile'
        });

        // Un utilisateur peut commenter plusieurs posts
        User.hasMany(models.PostComment, {
            foreignKey: 'user_id',
            as: 'comments'
        });

        // Un utilisateur peut avoir plusieurs rôles
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: 'user_id',
            otherKey: 'role_id',
            as: 'roles'
        });

        // Un utilisateur appartient à un post
        User.belongsTo(models.Post, {
            foreignKey: 'post_id',
            as: 'post'
        });
    };

    return User;
};
