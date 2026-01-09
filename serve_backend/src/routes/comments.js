const express = require('express');
const router = express.Router();

// Importer les middlewares de validation et d'authentification
const { validateAuthentication } = require('../midwave/auth');
const { validateCommentCreate, validateCommentUpdate } = require('../midwave/validateComment');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');
// Importer les contrôleurs
const {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} = require('../service/commentController');

// Routes des commentaires
// Récupérer tous les commentaires - Requiert l'authentification et la permission de lire les commentaires
router.get('/', validateAuthentication, checkMultipleRolesMiddleware('read_comment'), getAllComments);
// Récupérer un commentaire spécifique par ID - Requiert l'authentification et la permission de lire les commentaires
router.get('/:id', validateAuthentication, checkMultipleRolesMiddleware('read_comment'), getCommentById);
// Créer un nouveau commentaire - Requiert l'authentification, un rôle spécifique et la permission de créer des commentaires
router.post('/', validateAuthentication, checkMultipleRolesMiddleware('user' || 'moderator' || 'editor' || 'admin'), checkPermissionMiddleware('create_comment'), validateCommentCreate, createComment);
// Mettre à jour un commentaire - Requiert l'authentification, un rôle spécifique et la permission de mettre à jour les commentaires
router.put('/:id', validateAuthentication, checkMultipleRolesMiddleware('user' || 'moderator' || 'editor' || 'admin'), checkPermissionMiddleware('update_comment'), validateCommentUpdate, updateComment);
// Supprimer un commentaire - Requiert l'authentification, un rôle spécifique et la permission de supprimer les commentaires
router.delete('/:id', validateAuthentication, checkMultipleRolesMiddleware('user' || 'moderator' || 'editor' || 'admin'), checkPermissionMiddleware('delete_comment'), deleteComment);

module.exports = router;
