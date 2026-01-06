const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur commentaires
const {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} = require('../service/commentController');

// Routes CRUD pour les commentaires
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
