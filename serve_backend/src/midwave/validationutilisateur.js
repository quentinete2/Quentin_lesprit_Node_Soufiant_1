const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour les données utilisateur
const validateUtilisateur = async (req, res, next) => {
    // Définir les règles de validation
    await checkSchema({
        nom: { notEmpty: true },
        email: { isEmail: true },
        telephone: { notEmpty: true }
    }).run(req);
    
    // Vérifier les résultats de la validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            errors: validation.array()
        });
    }
    console.log("utilisateur validé");
    next();
};

module.exports = validateUtilisateur;
