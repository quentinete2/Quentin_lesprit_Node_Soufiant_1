const { Model } = require('sequelize');

const Post = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            this.hasMany(models.PostComment, {
                foreignKey: 'post_id',
                as: 'comments'
            });
        }
    }

    Post.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        content: DataTypes.TEXT,
        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Post;
};

module.exports = Post;
