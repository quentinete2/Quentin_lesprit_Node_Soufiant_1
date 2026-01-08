const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour la création d'un commentaire
const validateCommentCreate = async (req, res, next) => {
    await checkSchema({
        content: {
            notEmpty: { errorMessage: 'Content is required' },
            isLength: { options: { min: 2 }, errorMessage: 'Content must be at least 2 characters' }
        },
        post_id: {
            notEmpty: { errorMessage: 'Post ID is required' },
            isInt: { errorMessage: 'Post ID must be an integer' }
        },
        user_id: {
            notEmpty: { errorMessage: 'User ID is required' },
            isInt: { errorMessage: 'User ID must be an integer' }
        }
    }).run(req);
    
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    next();
};

// Middleware de validation pour la mise à jour d'un commentaire
const validateCommentUpdate = async (req, res, next) => {
    await checkSchema({
        content: {
            optional: true,
            isLength: { options: { min: 2 }, errorMessage: 'Content must be at least 2 characters' }
        }
    }).run(req);
    
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    next();
};

module.exports = {
    validateCommentCreate,
    validateCommentUpdate
};
