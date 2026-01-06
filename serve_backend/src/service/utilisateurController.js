const { User } = require('../models');

// Récupérer la liste de tous les utilisateurs
async function getAllUtilisateurs(req, res) {
    try {
        const utilisateurs = await User.findAll();
        if (!utilisateurs || utilisateurs.length === 0) {
            return res.status(404).json({
                message: "aucun utilisateur trouvé"
            });
        }
        res.status(200).json({
            message: "liste de tous les utilisateurs",
            data: utilisateurs
        });
    } catch (error) {
        res.status(500).json({
            message: "erreur lors de la récupération des utilisateurs",
            error: error.message
        });
    }
}

// Récupérer un utilisateur spécifique par ID
async function getUtilisateurById(req, res) {
    try {
        const { id } = req.params;
        const utilisateur = await User.findByPk(id);
        
        if (!utilisateur) {
            return res.status(404).json({
                message: "utilisateur non trouvé"
            });
        }
        
        res.status(200).json({
            message: "détail d'un utilisateur",
            data: utilisateur
        });
    } catch (error) {
        res.status(500).json({
            message: "erreur lors de la récupération de l'utilisateur",
            error: error.message
        });
    }
}

// Créer un nouvel utilisateur avec validation
async function createUtilisateur(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const { nom, email, telephone } = req.body;
        
        const nouvelUtilisateur = await User.create({
            nom,
            email,
            telephone
        }, { transaction });
        await transaction.commit();
        res.status(201).json({
            message: "utilisateur créé avec succès",
            data: nouvelUtilisateur
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "erreur lors de la création de l'utilisateur",
            error: error.message
        });
    }
}

// Mettre à jour les données d'un utilisateur
async function updateUtilisateur(req, res) {
    try {
        const { id } = req.params;
        const { nom, email, telephone } = req.body;
        
        const utilisateur = await User.findByPk(id);
        
        if (!utilisateur) {
            return res.status(404).json({
                message: "utilisateur non trouvé"
            });
        }
        
        // Mettre à jour seulement les champs fournis
        await utilisateur.update({
            nom: nom || utilisateur.nom,
            email: email || utilisateur.email,
            telephone: telephone || utilisateur.telephone
        });
        
        res.status(200).json({
            message: "utilisateur mis à jour avec succès",
            data: utilisateur
        });
    } catch (error) {
        res.status(500).json({
            message: "erreur lors de la mise à jour de l'utilisateur",
            error: error.message
        });
    }
}

// Supprimer un utilisateur
async function deleteUtilisateur(req, res) {
    try {
        const { id } = req.params;
        const utilisateur = await User.findByPk(id);
        
        if (!utilisateur) {
            return res.status(404).json({
                message: "utilisateur non trouvé"
            });
        }
        
        await utilisateur.destroy();
        
        res.status(200).json({
            message: "utilisateur supprimé avec succès",
            data: utilisateur
        });
    } catch (error) {
        res.status(500).json({
            message: "erreur lors de la suppression de l'utilisateur",
            error: error.message
        });
    }
}

module.exports = {
    getAllUtilisateurs,
    getUtilisateurById,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
};
