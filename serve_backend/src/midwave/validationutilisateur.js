const { checkSchema, body, validationResult } = require('express-validator');

// Middleware de validation pour l'enregistrement d'un nouvel utilisateur
const validateRegister = async (req, res, next) => {
    // Vérifier les champs requis pour l'enregistrement
    await checkSchema({
        username: { 
            // Vérifier que le nom d'utilisateur est fourni et a au moins 3 caractères
            notEmpty: { errorMessage: 'Username is required' },
            isLength: { options: { min: 3 }, errorMessage: 'Username must be at least 3 characters' }
        },
        email: { 
            // Vérifier le format de l'email et le normaliser
            isEmail: { errorMessage: 'Invalid email format' },
            normalizeEmail: true
        },
        password: { 
            // Vérifier que le mot de passe est fourni et a au moins 6 caractères
            notEmpty: { errorMessage: 'Password is required' },
            isLength: { options: { min: 6 }, errorMessage: 'Password must be at least 6 characters' }
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

// Middleware de validation pour la connexion
const validateLogin = async (req, res, next) => {
    // Vérifier les champs requis pour la connexion
    await checkSchema({
        username: { 
            // Vérifier que le nom d'utilisateur est fourni
            notEmpty: { errorMessage: 'Username is required' }
        },
        password: { 
            // Vérifier que le mot de passe est fourni
            notEmpty: { errorMessage: 'Password is required' }
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

// Middleware de validation pour les données utilisateur (général)
const validateUtilisateur = async (req, res, next) => {
    // Vérifier les champs généraux d'un utilisateur
    await checkSchema({
        username: { notEmpty: true },
        email: { isEmail: true },
        password: { notEmpty: true }
    }).run(req);
    
    // Récupérer les résultats de la validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        // Retourner les erreurs de validation
        return res.status(400).json({
            errors: validation.array()
        });
    }
    // Continuer au contrôleur suivant si la validation est correcte
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateUtilisateur
};
