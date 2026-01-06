const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur posts
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostComments
} = require('../service/postController');

// Routes CRUD pour les articles
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Route pour récupérer les commentaires d'un article
router.get('/:id/comments', getPostComments);

module.exports = router;
