const { Model } = require('sequelize');

const Permission = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            this.belongsToMany(models.Role, {
                through: models.RolePermission,
                foreignKey: 'permission_id',
                otherKey: 'role_id',
                as: 'roles'
            });
        }
    }

    Permission.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Permission;
};

module.exports = Permission;
