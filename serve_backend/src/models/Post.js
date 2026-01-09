const { Model } = require('sequelize');

// Modèle Post : Représente les articles/posts créés par les utilisateurs
const Post = (sequelize, DataTypes) => {
    class Post extends Model {
        // Définir les associations avec les autres modèles
        static associate(models) {
            // Un post appartient à un utilisateur
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            // Un post peut avoir plusieurs commentaires
            this.hasMany(models.PostComment, {
                foreignKey: 'post_id',
                as: 'comments'
            });
        }
    }

    // Initialiser le modèle avec les attributs
    Post.init({
        // ID de l'utilisateur qui a créé le post
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        // Titre du post
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Slug pour les URLs conviviales (optionnel)
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        // Contenu du post
        content: DataTypes.TEXT,
        // État du post : draft (brouillon), published (publié), archived (archivé)
        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        // Ajouter les timestamps created_at et updated_at
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Post;
};

module.exports = Post;
