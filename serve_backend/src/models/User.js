const { Model } = require('sequelize');

const User = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.hasOne(models.Profile, {
                foreignKey: 'user_id',
                as: 'profile'
            });

            this.hasMany(models.Post, {
                foreignKey: 'user_id',
                as: 'posts'
            });

            this.hasMany(models.PostComment, {
                foreignKey: 'user_id',
                as: 'comments'
            });

            this.belongsToMany(models.Role, {
                through: models.UserRole,
                foreignKey: 'user_id',
                otherKey: 'role_id',
                as: 'roles'
            });
        }

        clean() {
            const { password, token, updatedAt, createdAt, ...cleanedUser } = this.dataValues;
            return cleanedUser;
        }
    }

    User.init({
        token: DataTypes.TEXT,
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
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
