const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour la création d'un commentaire
const validateCommentCreate = async (req, res, next) => {
    // Vérifier les champs requis pour créer un commentaire
    await checkSchema({
        content: {
            // Vérifier que le contenu est fourni et a au moins 2 caractères
            notEmpty: { errorMessage: 'Content is required' },
            isLength: { options: { min: 2 }, errorMessage: 'Content must be at least 2 characters' }
        },
        post_id: {
            // Vérifier que l'ID du post est fourni et est un entier
            notEmpty: { errorMessage: 'Post ID is required' },
            isInt: { errorMessage: 'Post ID must be an integer' }
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

// Middleware de validation pour la mise à jour d'un commentaire
const validateCommentUpdate = async (req, res, next) => {
    // Vérifier les champs optionnels pour mettre à jour un commentaire
    await checkSchema({
        content: {
            // Le contenu est optionnel, mais s'il est fourni, doit avoir au moins 2 caractères
            optional: true,
            isLength: { options: { min: 2 }, errorMessage: 'Content must be at least 2 characters' }
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
    validateCommentCreate,
    validateCommentUpdate
};
