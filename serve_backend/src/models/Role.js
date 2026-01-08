const { Model } = require('sequelize');

const Role = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            this.belongsToMany(models.User, {
                through: models.UserRole,
                foreignKey: 'role_id',
                otherKey: 'user_id',
                as: 'users'
            });

            this.belongsToMany(models.Permission, {
                through: models.RolePermission,
                foreignKey: 'role_id',
                otherKey: 'permission_id',
                as: 'permissions'
            });
        }
    }

    Role.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Role;
};

module.exports = Role;
