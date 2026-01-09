const { PostComment } = require('../models');
const { sequelize } = require('../models');
const { tranporteur } = require('../utils/mailer');

// Contrôleur pour récupérer tous les commentaires avec les données du post et de l'auteur
exports.getAllComments = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Récupérer tous les commentaires avec le post et l'auteur associés
        const comments = await PostComment.findAll({
            include: ['post', 'author']
        }, { transaction });
        if (!comments || comments.length === 0) {
            await transaction.commit();
            return res.status(404).json({
                message: "Aucun commentaire trouvé"
            });
        }
        await transaction.commit();
        res.status(200).json({
            message: "Liste de tous les commentaires",
            data: comments
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la récupération des commentaires",
            error: error.message
        });
    }
};

// Contrôleur pour récupérer un commentaire spécifique par ID
exports.getCommentById = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le commentaire par ID avec le post et l'auteur
        const comment = await PostComment.findByPk(req.params.id, {
            include: ['post', 'author']
        }, { transaction });
        if (!comment) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Commentaire non trouvé"
            });
        }
        await transaction.commit();
        res.status(200).json({
            message: "Détail d'un commentaire",
            data: comment
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la récupération du commentaire",
            error: error.message
        });
    }
};

// Contrôleur pour créer un nouveau commentaire avec transaction
exports.createComment = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Extraire les données de la requête
        const { post_id, content } = req.body;
        // Utiliser l'ID de l'utilisateur connecté
        const user_id = req.user.id;
        
        // Créer le commentaire
        const comment = await PostComment.create({
            post_id,
            user_id,
            content
        }, { transaction });

        // Confirmer la transaction
        await transaction.commit();
        res.status(201).json({
            message: "Commentaire créé avec succès",
            data: comment
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du commentaire",
            error: error.message
        });
    }
};

// Contrôleur pour mettre à jour un commentaire existant avec transaction
exports.updateComment = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le commentaire par ID
        const comment = await PostComment.findByPk(req.params.id, { transaction });
        if (!comment) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Commentaire non trouvé"
            });
        }
        // Vérifier que seul le propriétaire du commentaire peut le modifier
        if (comment.user_id !== req.user.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: "Vous ne pouvez modifier que vos propres commentaires"
            });
        }
        // Ne permettre la mise à jour que du contenu
        const { content } = req.body;
        await comment.update({ content }, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Commentaire mis à jour avec succès",
            data: comment
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du commentaire",
            error: error.message
        });
    }
};

// Contrôleur pour supprimer un commentaire avec transaction
exports.deleteComment = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le commentaire par ID
        const comment = await PostComment.findByPk(req.params.id, { transaction });
        if (!comment) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Commentaire non trouvé"
            });
        }
        // Vérifier que seul le propriétaire du commentaire peut le supprimer
        if (comment.user_id !== req.user.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: "Vous ne pouvez supprimer que vos propres commentaires"
            });
        }
        // Supprimer le commentaire
        await comment.destroy({ transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Commentaire supprimé avec succès",
            data: comment
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du commentaire",
            error: error.message
        });
    }
};
