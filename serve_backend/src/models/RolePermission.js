const { DataTypes } = require('sequelize');

// Modèle RolePermission table d'association many-to-many entre rôles et permissions
module.exports = (sequelize) => {
    const RolePermission = sequelize.define('RolePermission', {
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
        tableName: 'role_permissions',
        timestamps: false
    });

    RolePermission.associate = (models) => {
    };

    return RolePermission;
};
