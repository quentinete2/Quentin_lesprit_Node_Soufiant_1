const { checkSchema, body, validationResult } = require('express-validator');

// Middleware de validation pour l'enregistrement
const validateRegister = async (req, res, next) => {
    await checkSchema({
        username: { 
            notEmpty: { errorMessage: 'Username is required' },
            isLength: { options: { min: 3 }, errorMessage: 'Username must be at least 3 characters' }
        },
        email: { 
            isEmail: { errorMessage: 'Invalid email format' },
            normalizeEmail: true
        },
        password: { 
            notEmpty: { errorMessage: 'Password is required' },
            isLength: { options: { min: 6 }, errorMessage: 'Password must be at least 6 characters' }
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

// Middleware de validation pour la connexion
const validateLogin = async (req, res, next) => {
    await checkSchema({
        username: { 
            notEmpty: { errorMessage: 'Username is required' }
        },
        password: { 
            notEmpty: { errorMessage: 'Password is required' }
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

// Middleware de validation pour les données utilisateur (général)
const validateUtilisateur = async (req, res, next) => {
    await checkSchema({
        username: { notEmpty: true },
        email: { isEmail: true },
        password: { notEmpty: true }
    }).run(req);
    
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            errors: validation.array()
        });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateUtilisateur
};
