const { Model } = require('sequelize');

// Modèle Role : Représente les rôles d'utilisateurs avec leurs permissions
const Role = (sequelize, DataTypes) => {
    class Role extends Model {
        // Définir les associations avec les autres modèles
        static associate(models) {
            // Un rôle peut être assigné à plusieurs utilisateurs (relation many-to-many)
            this.belongsToMany(models.User, {
                through: models.UserRole,
                foreignKey: 'role_id',
                otherKey: 'user_id',
                as: 'users'
            });

            // Un rôle peut avoir plusieurs permissions (relation many-to-many)
            this.belongsToMany(models.Permission, {
                through: models.RolePermission,
                foreignKey: 'role_id',
                otherKey: 'permission_id',
                as: 'permissions'
            });
        }
    }

    // Initialiser le modèle avec les attributs
    Role.init({
        // Nom du rôle (ex: admin, user, moderator)
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        // Description du rôle et ses responsabilités
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        // Ajouter les timestamps created_at et updated_at
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Role;
};

module.exports = Role;
