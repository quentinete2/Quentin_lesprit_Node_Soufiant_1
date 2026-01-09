const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware pour valider l'authentification avec JWT
const validateAuthentication = (req, res, next) => {
    // Récupérer le token du header Authorization
    const token = req.headers['authorization'];
    // Vérifier que le token est présent
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Vérifier la signature du token JWT
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        // Si le token est invalide
        if(err) return res.status(403).json({ message: 'Wrong JWT token' });
        // Vérifier que l'utilisateur existe et qu'il a ce token actif
        const user = await User.findOne({ where: { token } });
        if (!user) return res.status(403).json({ message: 'Session expired' });
        // Ajouter l'utilisateur aux informations de la requête
        req.user = user;
        // Continuer au middleware/contrôleur suivant
        next();
    })
};

module.exports = {
    validateAuthentication
}