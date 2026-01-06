const { DataTypes } = require('sequelize');

// Modèle PostComment représentant les commentaires sur les articles
module.exports = (sequelize) => {
    const PostComment = sequelize.define('PostComment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
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
        tableName: 'post_comments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // Associations: un commentaire appartient à un article et un utilisateur
    PostComment.associate = (models) => {
        PostComment.belongsTo(models.Post, {
            foreignKey: 'post_id',
            as: 'post'
        });

        PostComment.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'author'
        });
    };

    return PostComment;
};
