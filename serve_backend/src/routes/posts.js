const express = require('express');
const router = express.Router();

// Importer les middlewares de validation et d'authentification
const { validateAuthentication } = require('../midwave/auth');
const { validatePostCreate, validatePostUpdate } = require('../midwave/validatePost');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');
// Importer les contrôleurs
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('../service/postController');

// Routes des posts
// Récupérer tous les posts - Requiert l'authentification
router.get('/', validateAuthentication, getAllPosts);
// Récupérer un post spécifique par ID - Requiert l'authentification
router.get('/:id', validateAuthentication, getPostById);
// Créer un nouveau post - Requiert l'authentification et un rôle spécifique
router.post('/', validateAuthentication, checkMultipleRolesMiddleware(['user', 'moderator', 'editor', 'admin']), validatePostCreate, createPost);
// Mettre à jour un post - Requiert l'authentification et un rôle spécifique
router.put('/:id', validateAuthentication, checkMultipleRolesMiddleware(['user', 'moderator', 'editor', 'admin']), validatePostUpdate, updatePost);
// Supprimer un post - Requiert l'authentification et un rôle spécifique
router.delete('/:id', validateAuthentication, checkMultipleRolesMiddleware(['user', 'moderator', 'editor', 'admin']), deletePost);

module.exports = router;
