const { DataTypes } = require('sequelize');

// Modèle Post représentant les articles/posts de l'application
module.exports = (sequelize) => {
    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'posts',
        timestamps: false
    });

    // Associations: un post peut avoir plusieurs commentaires
    Post.associate = (models) => {
        Post.hasMany(models.PostComment, {
            foreignKey: 'post_id',
            as: 'comments'
        });
    };

    return Post;
};

