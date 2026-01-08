const { PostComment } = require('../models');
const { sequelize } = require('../models');
const { tranporteur } = require('../utils/mailer');

// Récupérer tous les commentaires avec les données du post et de l'auteur
exports.getAllComments = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
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

// Récupérer un commentaire spécifique par ID
exports.getCommentById = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
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

// Créer un nouveau commentaire avec transaction
exports.createComment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { post_id, user_id, content } = req.body;
        const comment = await PostComment.create({
            post_id,
            user_id,
            content
        }, { transaction });

        await transaction.commit();
        res.status(201).json({
            message: "Commentaire créé avec succès",
            data: comment
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du commentaire",
            error: error.message
        });
    }
};

// Mettre à jour un commentaire existant avec transaction
exports.updateComment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const comment = await PostComment.findByPk(req.params.id, { transaction });
        if (!comment) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Commentaire non trouvé"
            });
        }
        await comment.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Commentaire mis à jour avec succès",
            data: comment
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du commentaire",
            error: error.message
        });
    }
};

// Supprimer un commentaire avec transaction
exports.deleteComment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const comment = await PostComment.findByPk(req.params.id, { transaction });
        if (!comment) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Commentaire non trouvé"
            });
        }
        await comment.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Commentaire supprimé avec succès",
            data: comment
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du commentaire",
            error: error.message
        });
    }
};
