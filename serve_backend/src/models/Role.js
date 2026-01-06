const { DataTypes } = require('sequelize');

// Modèle Role représentant les rôles d'accès de l'application
module.exports = (sequelize) => {
    const Role = sequelize.define('Role', {
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
        tableName: 'roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // Associations: un rôle peut avoir plusieurs utilisateurs et permissions
    Role.associate = (models) => {
        // Association many-to-many avec les utilisateurs
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: 'role_id',
            otherKey: 'user_id',
            as: 'users'
        });

        // Association many-to-many avec les permissions
        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: 'role_id',
            otherKey: 'permission_id',
            as: 'permissions'
        });
    };

    return Role;
};
