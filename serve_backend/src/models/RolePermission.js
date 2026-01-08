const { Model } = require('sequelize');

const RolePermission = (sequelize, DataTypes) => {
    class RolePermission extends Model {
        static associate(models) {
        }
    }

    RolePermission.init({
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        permission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'permissions',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'role_permissions',
        timestamps: false
    });

    return RolePermission;
};

module.exports = RolePermission;
