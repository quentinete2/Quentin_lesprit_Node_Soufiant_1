const { Profile, User, Role, UserRole } = require('../models');
const { sequelize } = require('../models');

// Contrôleur pour récupérer tous les profils avec les données d'utilisateur associés
exports.getAllProfiles = async (req, res) => {
    try {
        // Récupérer tous les profils avec les utilisateurs associés
        const profiles = await Profile.findAll({
            include: ['user']
        });
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({
                message: "Aucun profil trouvé"
            });
        }
        res.status(200).json({
            message: "Liste de tous les profils",
            data: profiles
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des profils",
            error: error.message
        });
    }
};

// Contrôleur pour récupérer un profil spécifique par ID
exports.getProfileById = async (req, res) => {
    try {
        // Chercher le profil par ID avec l'utilisateur associé
        const profile = await Profile.findByPk(req.params.id, {
            include: ['user']
        });
        if (!profile) {
            return res.status(404).json({
                message: "Profil non trouvé"
            });
        }
        res.status(200).json({
            message: "Détail d'un profil",
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du profil",
            error: error.message
        });
    }
};

// Contrôleur pour créer un nouveau profil avec transaction et assigner un rôle
exports.createProfile = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Extraire les données de la requête
        const { first_name, last_name, birthdate, phone, address, bio } = req.body;
        // Utiliser l'ID de l'utilisateur connecté
        const user_id = req.user.id;
        
        // Créer le profil
        const profile = await Profile.create({
            user_id,
            first_name,
            last_name,
            birthdate,
            phone,
            address,
            bio
        }, { transaction });
        
        // Vérifier si tous les champs requis sont complétés
        const isProfileComplete = first_name && last_name && birthdate && phone && address && bio;
        
        if (isProfileComplete) {
            // Récupérer le rôle "user" par défaut
            const userRole = await Role.findOne({
                where: { name: 'user' }
            }, { transaction });
            
            if (userRole) {
                // Vérifier si l'utilisateur a déjà ce rôle
                const existingUserRole = await UserRole.findOne({
                    where: {
                        user_id,
                        role_id: userRole.id
                    }
                }, { transaction });
                
                // Assigner le rôle seulement s'il ne l'a pas déjà
                if (!existingUserRole) {
                    await UserRole.create({
                        user_id,
                        role_id: userRole.id,
                        assigned_at: new Date()
                    }, { transaction });
                }
            }
        }
        
        // Confirmer la transaction
        await transaction.commit();
        res.status(201).json({
            message: "Profil créé avec succès",
            data: profile,
            roleAssigned: isProfileComplete
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du profil",
            error: error.message
        });
    }
};

// Contrôleur pour mettre à jour un profil existant avec transaction
exports.updateProfile = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le profil par ID
        const profile = await Profile.findByPk(req.params.id, { transaction });
        if (!profile) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Profil non trouvé"
            });
        }
        // Vérifier que seul le propriétaire du profil peut le modifier
        if (profile.user_id !== req.user.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: "Vous ne pouvez modifier que votre propre profil"
            });
        }
        // Mettre à jour le profil avec les nouvelles données
        await profile.update(req.body, { transaction });
        
        // Vérifier si tous les champs requis sont complétés après la mise à jour
        const isProfileComplete = profile.first_name && profile.last_name && 
                                  profile.birthdate && profile.phone && 
                                  profile.address && profile.bio;
        
        if (isProfileComplete) {
            // Récupérer le rôle "user" par défaut
            const userRole = await Role.findOne({
                where: { name: 'user' }
            }, { transaction });
            
            if (userRole) {
                // Vérifier si l'utilisateur a déjà ce rôle
                const existingUserRole = await UserRole.findOne({
                    where: {
                        user_id: profile.user_id,
                        role_id: userRole.id
                    }
                }, { transaction });
                
                // Assigner le rôle seulement s'il ne l'a pas déjà
                if (!existingUserRole) {
                    await UserRole.create({
                        user_id: profile.user_id,
                        role_id: userRole.id,
                        assigned_at: new Date()
                    }, { transaction });
                }
            }
        }
        
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Profil mis à jour avec succès",
            data: profile,
            roleAssigned: isProfileComplete
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du profil",
            error: error.message
        });
    }
};

// Contrôleur pour supprimer un profil avec transaction
exports.deleteProfile = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le profil par ID
        const profile = await Profile.findByPk(req.params.id, { transaction });
        if (!profile) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Profil non trouvé"
            });
        }
        // Vérifier que seul le propriétaire du profil peut le supprimer
        if (profile.user_id !== req.user.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: "Vous ne pouvez supprimer que votre propre profil"
            });
        }
        // Supprimer le profil
        await profile.destroy({ transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Profil supprimé avec succès",
            data: profile
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du profil",
            error: error.message
        });
    }
};
