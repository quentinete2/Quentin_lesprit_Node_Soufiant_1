const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour la création d'un post
const validatePostCreate = async (req, res, next) => {
    // Vérifier les champs requis pour créer un post
    await checkSchema({
        title: {
            // Vérifier que le titre est fourni et a au moins 5 caractères
            notEmpty: { errorMessage: 'Title is required' },
            isLength: { options: { min: 5 }, errorMessage: 'Title must be at least 5 characters' }
        },
        content: {
            // Vérifier que le contenu est fourni et a au moins 10 caractères
            notEmpty: { errorMessage: 'Content is required' },
            isLength: { options: { min: 10 }, errorMessage: 'Content must be at least 10 characters' }
        },
        user_id: {
            // Vérifier que l'ID utilisateur est fourni et est un entier
            notEmpty: { errorMessage: 'User ID is required' },
            isInt: { errorMessage: 'User ID must be an integer' }
        }
    }).run(req);
    
    // Récupérer les résultats de la validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        // Retourner les erreurs de validation
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    // Continuer au contrôleur suivant si la validation est correcte
    next();
};

// Middleware de validation pour la mise à jour d'un post
const validatePostUpdate = async (req, res, next) => {
    // Vérifier les champs optionnels pour mettre à jour un post
    await checkSchema({
        title: {
            // Le titre est optionnel, mais s'il est fourni, doit avoir au moins 5 caractères
            optional: true,
            isLength: { options: { min: 5 }, errorMessage: 'Title must be at least 5 characters' }
        },
        content: {
            // Le contenu est optionnel, mais s'il est fourni, doit avoir au moins 10 caractères
            optional: true,
            isLength: { options: { min: 10 }, errorMessage: 'Content must be at least 10 characters' }
        }
    }).run(req);
    
    // Récupérer les résultats de la validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        // Retourner les erreurs de validation
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    // Continuer au contrôleur suivant si la validation est correcte
    next();
};

module.exports = {
    validatePostCreate,
    validatePostUpdate
};
