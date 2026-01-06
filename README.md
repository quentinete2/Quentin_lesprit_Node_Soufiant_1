# Quentin - Soufiant API

Application API Node.js/Express pour gérer un système complet de gestion d'utilisateurs, posts, commentaires, rôles et permissions.

## 📋 Table des matières
- [Description](#description)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)

## 📝 Description

**Soufiant** est une API RESTful complète construite avec:
- **Node.js** et **Express** pour la gestion des requêtes HTTP
- **Sequelize** comme ORM pour interagir avec la base de données MariaDB
- **MySQL2/MariaDB** comme système de gestion de base de données
- **Docker** pour containeriser l'application et la base de données

L'API permet de gérer:
- Les utilisateurs et profils
- Les articles (posts) et commentaires
- Un système complet de rôles et permissions
- Les associations entre utilisateurs et rôles

## 🛠 Technologies

| Technologie | Version |
|-------------|---------|
| Node.js | 24 (Alpine) |
| Express | ^5.2.1 |
| Sequelize | ^6.35.2 |
| MariaDB | ^3.2.7 |
| MySQL2 | ^3.6.5 |
| Express Validator | ^7.3.1 |
| Dotenv | ^16.3.1 |
| Nodemon | (dev) |

## 📦 Installation

### Prérequis
- **Docker** et **Docker Compose**
- OU Node.js >= 20 et MariaDB installés localement

### Option 1 : Avec Docker Compose (Recommandé)

```bash
# Cloner le repository
git clone <repository-url>
cd Quentin_lesprit_Node_Soufiant_1

# Démarrer les services (Node.js + MariaDB)
docker-compose up -d

# Vérifier que le serveur fonctionne
curl http://localhost:3000/home
```

### Option 2 : Installation locale

```bash
# Installer les dépendances
cd serve_backend
npm install

# Créer un fichier .env
cp config/config.json .env

# Démarrer le serveur (mode développement)
npm run dev
```

## 🔧 Configuration

### Variables d'environnement (.env)

Créer un fichier `.env` à la racine du dossier `serve_backend`:

```
SERVER_PORT=3000
DB_HOST=db
DB_PORT=3306
DB_NAME=utilisateurs
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
NODE_ENV=development
```

### Configuration Docker Compose

Le fichier `docker-compose.yml` configure:
- **Service Node.js**: Port 3000, nodemon en mode dev
- **Service MariaDB**: Port 3306, base de données `utilisateurs`

```bash
# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f app
docker-compose logs -f db
```

## 🚀 Démarrage

### Avec Docker Compose
```bash
docker-compose up
```

### En local
```bash
cd serve_backend
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 📂 Structure du projet

```
serve_backend/
├── src/
│   ├── app.js                          # Point d'entrée principal
│   ├── models/                         # Modèles Sequelize
│   │   ├── User.js                     # Modèle Utilisateur
│   │   ├── Profile.js                  # Profil utilisateur
│   │   ├── Product.js                  # Articles/Posts
│   │   ├── PostComment.js              # Commentaires
│   │   ├── Role.js                     # Rôles
│   │   ├── Permission.js               # Permissions
│   │   ├── UserRole.js                 # Association User-Role
│   │   ├── RolePermission.js           # Association Role-Permission
│   │   └── index.js                    # Initialisation des modèles
│   ├── routes/                         # Routes de l'API
│   │   ├── index.js                    # Centralisateur de routes
│   │   ├── users.js                    # Routes utilisateurs
│   │   ├── profiles.js                 # Routes profils
│   │   ├── posts.js                    # Routes articles
│   │   ├── comments.js                 # Routes commentaires
│   │   ├── roles.js                    # Routes rôles
│   │   ├── permissions.js              # Routes permissions
│   │   ├── userRoles.js                # Routes associations User-Role
│   │   ├── rolePermissions.js          # Routes associations Role-Permission
│   │   └── utilisateurs.js             # Routes alternatives
│   ├── service/                        # Contrôleurs/Logique métier
│   │   ├── userController.js           # Logique utilisateurs
│   │   ├── profileController.js        # Logique profils
│   │   ├── postController.js           # Logique articles
│   │   ├── commentController.js        # Logique commentaires
│   │   ├── roleController.js           # Logique rôles
│   │   ├── permissionController.js     # Logique permissions
│   │   └── utilisateurController.js    # Contrôleur alternatif
│   ├── migrations/                     # Migrations Sequelize
│   │   └── [fichiers de migration]
│   └── middleware/
│       └── validationutilisateur.js    # Middleware de validation
├── config/
│   └── config.json                     # Configuration de base de données
├── package.json                        # Dépendances du projet
└── .env                                # Variables d'environnement

```

## 🔌 API Endpoints

### Santé
- `GET /home` - Vérifier que l'API fonctionne

### Utilisateurs
- `GET /api/users` - Lister tous les utilisateurs
- `GET /api/users/:id` - Récupérer un utilisateur
- `POST /api/users` - Créer un nouvel utilisateur
- `PUT /api/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Profils
- `GET /api/profiles` - Lister les profils
- `POST /api/profiles` - Créer un profil
- `PUT /api/profiles/:id` - Mettre à jour un profil
- `DELETE /api/profiles/:id` - Supprimer un profil

### Articles (Posts)
- `GET /api/posts` - Lister les articles
- `POST /api/posts` - Créer un article
- `PUT /api/posts/:id` - Mettre à jour un article
- `DELETE /api/posts/:id` - Supprimer un article

### Commentaires
- `GET /api/comments` - Lister les commentaires
- `POST /api/comments` - Créer un commentaire
- `PUT /api/comments/:id` - Mettre à jour un commentaire
- `DELETE /api/comments/:id` - Supprimer un commentaire

### Rôles
- `GET /api/roles` - Lister les rôles
- `POST /api/roles` - Créer un rôle
- `PUT /api/roles/:id` - Mettre à jour un rôle
- `DELETE /api/roles/:id` - Supprimer un rôle

### Permissions
- `GET /api/permissions` - Lister les permissions
- `POST /api/permissions` - Créer une permission
- `PUT /api/permissions/:id` - Mettre à jour une permission
- `DELETE /api/permissions/:id` - Supprimer une permission

### Associations
- `GET /api/user-roles` - Lister les associations User-Role
- `POST /api/user-roles` - Associer un rôle à un utilisateur
- `GET /api/role-permissions` - Lister les associations Role-Permission
- `POST /api/role-permissions` - Associer une permission à un rôle

## 🗄️ Base de données

### Schéma relationnel
Voir [SCHEMA_RELATIONNEL.md](./SCHEMA_RELATIONNEL.md) pour le diagramme complet des tables et relations.

### Tables principales
- **users**: Utilisateurs du système
- **profiles**: Profils associés aux utilisateurs
- **posts**: Articles publiés
- **post_comments**: Commentaires sur les articles
- **roles**: Définition des rôles
- **permissions**: Définition des permissions
- **user_roles**: Association many-to-many entre utilisateurs et rôles
- **role_permissions**: Association many-to-many entre rôles et permissions

### Migrations
Les migrations Sequelize sont disponibles dans `serve_backend/src/migrations/`. Elles sont exécutées automatiquement lors du démarrage de l'application.

## 🧪 Tests

Pour tester l'API, utilisez **Postman** ou **cURL**:

```bash
# Test de santé
curl http://localhost:3000/home

# Créer un utilisateur
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password_hash": "hashed_password"}'
```

Une collection Postman est disponible dans [postman_collection.json](./postman_collection.json)

## 📚 Documentation supplémentaire

- Schéma de base de données: [SCHEMA_RELATIONNEL.md](./SCHEMA_RELATIONNEL.md)
- Configuration Docker: [docker-compose.yml](./docker-compose.yml)
- Dockerfile: [Dockerfile](./Dockerfile)

## 🤝 Contribution

Suggestions pour améliorer le projet:
1. Ajouter une authentification JWT
2. Implémenter les validations côté serveur avec express-validator
3. Ajouter des tests unitaires avec Jest
4. Mettre en place la gestion des erreurs globale
5. Ajouter la pagination et les filtres

## 📄 Licence

ISC

---

**Auteur**: Quentin  
**Dernière mise à jour**: 6 janvier 2026
