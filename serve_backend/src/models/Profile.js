const { Model } = require('sequelize');

const Profile = (sequelize, DataTypes) => {
    class Profile extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    Profile.init({
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        birthdate: DataTypes.DATEONLY,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        bio: DataTypes.TEXT,
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Profile',
        tableName: 'profiles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Profile;
};

module.exports = Profile;
