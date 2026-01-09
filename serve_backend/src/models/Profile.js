const { Model } = require('sequelize');

// Modèle Profile : Représente le profil complet d'un utilisateur avec ses informations personnelles
const Profile = (sequelize, DataTypes) => {
    class Profile extends Model {
        // Définir les associations avec les autres modèles
        static associate(models) {
            // Un profil appartient à un utilisateur
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    // Initialiser le modèle avec les attributs
    Profile.init({
        // Prénom de l'utilisateur
        first_name: DataTypes.STRING,
        // Nom de famille de l'utilisateur
        last_name: DataTypes.STRING,
        // Date de naissance
        birthdate: DataTypes.DATEONLY,
        // Numéro de téléphone
        phone: DataTypes.STRING,
        // Adresse complète
        address: DataTypes.STRING,
        // Biographie/description personnelle
        bio: DataTypes.TEXT,
        // ID de l'utilisateur associé (relation 1-1)
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
        // Ajouter les timestamps created_at et updated_at
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Profile;
};

module.exports = Profile;
