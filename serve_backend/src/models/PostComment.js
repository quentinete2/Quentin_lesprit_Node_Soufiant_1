const { Model } = require('sequelize');

const PostComment = (sequelize, DataTypes) => {
    class PostComment extends Model {
        static associate(models) {
            this.belongsTo(models.Post, {
                foreignKey: 'post_id',
                as: 'post'
            });

            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'author'
            });
        }
    }

    PostComment.init({
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
        }
    }, {
        sequelize,
        modelName: 'PostComment',
        tableName: 'post_comments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return PostComment;
};

module.exports = PostComment;
