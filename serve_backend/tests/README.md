# Guide des Tests - Node Soufiant API

## Installation des dépendances de test

```bash
npm install --save-dev jest supertest @testing-library/node
```

## Exécuter les tests

### Tous les tests
```bash
npm test
```

### Tests avec couverture
```bash
npm test -- --coverage
```

### Tests en mode watch
```bash
npm test -- --watch
```

### Tests spécifiques
```bash
npm test -- tests/controllers/userController.test.js
npm test -- --testNamePattern="login"
```

## Structure des tests

```
tests/
├── controllers/              # Tests unitaires des services
│   └── userController.test.js
│
├── middleware/               # Tests unitaires des middlewares
│   └── auth.test.js
│
├── validators/              # Tests unitaires des validations
│   └── validation.test.js
│
├── routes/                  # Tests fonctionnels/d'intégration
│   ├── auth.test.js
│   ├── profiles.test.js
│   ├── posts.test.js
│   └── comments.test.js
│
├── utils/                   # Tests utilitaires
│   └── (à compléter)
│
├── setup.js                 # Configuration globale des tests
└── jest.config.js           # Configuration Jest
```

## Types de tests

### 1. Tests Unitaires
- Testent une fonction/méthode isolément
- Utilisent des mocks pour les dépendances externes
- Fichiers: `controllers/*.test.js`, `middleware/*.test.js`, `validators/*.test.js`

Exemple:
```javascript
describe('UserController - Unit Tests', () => {
  it('should register a new user', async () => {
    // Arrange
    const mockData = { ... };
    
    // Act
    const result = await register(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

### 2. Tests Fonctionnels/Intégration
- Testent le flux complet requête → réponse
- Utilisent `supertest` pour les requêtes HTTP
- Fichiers: `routes/*.test.js`

Exemple:
```javascript
describe('Authentication Routes - Functional Tests', () => {
  it('should register and return 201', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(response.status).toBe(201);
  });
});
```

## Couverture de test cible

- Branches: 50%
- Fonctions: 50%
- Lignes: 50%
- Statements: 50%

## Mocking avec Jest

### Mocker un module
```javascript
jest.mock('../../src/models');
```

### Mocker une fonction
```javascript
jest.fn().mockResolvedValue(data);
jest.fn().mockRejectedValue(error);
jest.fn().mockImplementation((arg) => { ... });
```

### Vérifier les appels
```javascript
expect(User.create).toHaveBeenCalled();
expect(User.create).toHaveBeenCalledWith(expectedData);
expect(User.create).toHaveBeenCalledTimes(1);
```

## Bonnes pratiques

1. **Nommer les tests clairement**
   ```javascript
   it('should return 404 when user not found', async () => { ... });
   ```

2. **Utiliser beforeEach pour l'initialisation**
   ```javascript
   beforeEach(() => {
     req = { ... };
     res = { ... };
     jest.clearAllMocks();
   });
   ```

3. **Tester les cas d'erreur**
   - Entrées invalides
   - Ressources non trouvées
   - Erreurs de base de données

4. **Un assertion par test (ou grouper logiquement)**
   ```javascript
   // Bon
   it('should set user and call next', () => {
     expect(req.user).toEqual(mockUser);
     expect(next).toHaveBeenCalled();
   });
   ```

5. **Isoler les tests**
   - Chaque test doit être indépendant
   - Utiliser `clearAllMocks()` entre les tests

## Ajouter de nouveaux tests

### Pour un nouveau contrôleur:
1. Créer `tests/controllers/nameController.test.js`
2. Importer le contrôleur et ses dépendances
3. Mocker les dépendances externes
4. Écrire les tests pour chaque fonction

### Pour une nouvelle route:
1. Créer `tests/routes/name.test.js`
2. Tester tous les cas : succès et erreurs
3. Vérifier l'authentification si nécessaire

## Débogage des tests

```bash
# Avec node inspect
node --inspect-brk node_modules/.bin/jest

# Avec logs détaillés
npm test -- --verbose
```

## Intégration continue

Ajoutez au `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```
