const { DataTypes } = require('sequelize');

// Modèle Permission représentant les permissions du système
module.exports = (sequelize) => {
    const Permission = sequelize.define('Permission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // Association: une permission peut être assignée à plusieurs rôles
    Permission.associate = (models) => {
        Permission.belongsToMany(models.Role, {
            through: models.RolePermission,
            foreignKey: 'permission_id',
            otherKey: 'role_id',
            as: 'roles'
        });
    };

    return Permission;
};
