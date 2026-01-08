# 🚀 Soufiant API - Documentation Complète

Application API REST complète pour la gestion d'utilisateurs, articles, commentaires, rôles et permissions, construite avec Node.js, Express et Sequelize.

---

## 📋 Table des matières

- [Description](#-description)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Base de données](#-base-de-données)
- [Authentification](#-authentification)
- [Seeders](#-seeders)
- [Tests](#-tests)

---

## 📝 Description

**Soufiant** est une plateforme complète de gestion de contenu et d'utilisateurs qui fournit:

✅ **Gestion des utilisateurs**: Authentification, profils, permissions  
✅ **Système de rôles**: Admin, Modérateur, Éditeur, Utilisateur  
✅ **Gestion de contenu**: Articles (posts), commentaires, statuts  
✅ **Système de permissions**: Granulaire, basé sur les rôles  
✅ **Architecture scalable**: Migrations, seeders, tests inclus  
✅ **Containerisée**: Docker Compose pour une installation facile  

---

## 🛠 Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 24 (Alpine) | Runtime JavaScript |
| Express | ^5.2.1 | Framework HTTP |
| Sequelize | ^6.37.7 | ORM pour MySQL/MariaDB |
| MariaDB | latest | Base de données relationnelle |
| MySQL2 | ^3.6.5 | Driver MySQL pour Node.js |
| bcryptjs | ^2.4.3 | Hachage des mots de passe |
| jsonwebtoken | ^9.1.2 | Tokens d'authentification JWT |
| dotenv | ^16.3.1 | Gestion des variables d'environnement |
| Nodemon | (dev) | Rechargement automatique en dev |
| Jest | ^29.7.0 | Framework de test |

---

## 📦 Installation

### Prérequis

- **Docker & Docker Compose** (recommandé)
- OU **Node.js >= 20** + **MariaDB >= 10.5**

### Option 1: Avec Docker Compose (Recommandé) ⭐

```bash
# 1. Cloner le repository
git clone <repository-url>
cd Quentin_lesprit_Node_Soufiant_1

# 2. Démarrer les services
docker-compose up -d

# 3. Vérifier que tout fonctionne
curl http://localhost:3000/home

# 4. Accéder à MailHog (emails en dev)
open http://localhost:1025
```

### Option 2: Installation locale

```bash
# 1. Installer les dépendances
cd serve_backend
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Configurer MariaDB localement
# Créer une base de données 'utilisateurs'
# Configurer les accès dans .env

# 4. Exécuter les migrations
npm run migrate

# 5. Seeder la base de données
npm run seed

# 6. Démarrer le serveur en développement
npm run dev
```

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Serveur
SERVER_PORT=3000
NODE_ENV=development

# Base de données
DB_HOST=serve_backend-db
DB_PORT=3306
DB_NAME=utilisateurs
DB_USER=root
DB_PASSWORD=root

# Authentification
SECRET_KEY=your_super_secret_key_here
SALT=10

# Email (MailHog en local)
ADMIN_EMAIL=admin@soufiant.local
MAIL_HOST=serve_backend-mailhog
MAIL_PORT=1025
```

### Ports utilisés

| Service | Port | URL |
|---------|------|-----|
| API Node.js | 3000 | http://localhost:3000 |
| MariaDB | 3306 | mysql://root:root@localhost:3306/utilisateurs |
| MailHog | 1025 | http://localhost:1025 |

---

## 🚀 Démarrage

### Avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f serve_backend
docker-compose logs -f serve_backend-db

# Arrêter les services
docker-compose down

# Nettoyer complètement (volumes inclus)
docker-compose down -v
```

### En local

```bash
cd serve_backend
npm run dev
```

Le serveur démarre sur **http://localhost:3000** 🎉

---

## 📂 Structure du projet

```
Quentin_lesprit_Node_Soufiant_1/
├── serve_backend/
│   ├── src/
│   │   ├── app.js                      # Point d'entrée Express
│   │   ├── models/                     # Modèles Sequelize
│   │   │   ├── User.js                 # Modèle Utilisateur
│   │   │   ├── Profile.js              # Profil utilisateur
│   │   │   ├── Post.js                 # Articles
│   │   │   ├── PostComment.js          # Commentaires
│   │   │   ├── Role.js                 # Rôles
│   │   │   ├── Permission.js           # Permissions
│   │   │   ├── UserRole.js             # Association User-Role (M:N)
│   │   │   ├── RolePermission.js       # Association Role-Permission (M:N)
│   │   │   └── index.js                # Initialisation
│   │   ├── routes/                     # Routes API
│   │   │   ├── index.js                # Centralisateur
│   │   │   ├── auth.js                 # Auth (login, register, logout)
│   │   │   ├── users.js                # Utilisateurs (GET, DELETE)
│   │   │   ├── profiles.js             # Profils (CRUD)
│   │   │   ├── posts.js                # Articles (CRUD)
│   │   │   ├── comments.js             # Commentaires (CRUD)
│   │   │   ├── roles.js                # Rôles (CRUD)
│   │   │   ├── permissions.js          # Permissions (CRUD)
│   │   │   ├── userRoles.js            # Associations User-Role
│   │   │   └── rolePermissions.js      # Associations Role-Permission
│   │   ├── service/                    # Contrôleurs (logique métier)
│   │   │   ├── userController.js       # Utilisateurs
│   │   │   ├── profileController.js    # Profils
│   │   │   ├── postController.js       # Articles
│   │   │   ├── commentController.js    # Commentaires
│   │   │   ├── roleController.js       # Rôles
│   │   │   └── permissionController.js # Permissions
│   │   ├── midwave/                    # Middleware
│   │   │   ├── auth.js                 # Authentification JWT
│   │   │   └── validate*.js            # Validations
│   │   ├── migrations/                 # Migrations Sequelize
│   │   │   ├── 20260108-001-create-users.js
│   │   │   ├── 20260108-002-create-profiles.js
│   │   │   └── ...
│   │   ├── seeders/                    # Seeders de données
│   │   │   ├── 20260108-001-seed-roles.js
│   │   │   ├── 20260108-002-seed-permissions.js
│   │   │   └── ...
│   │   └── utils/
│   │       └── mailer.js               # Service d'email
│   ├── config/
│   │   └── config.json                 # Config Sequelize
│   ├── tests/
│   │   ├── controllers/
│   │   │   ├── userController.test.js
│   │   │   └── ...
│   │   └── setup.js                    # Setup des tests
│   ├── package.json
│   ├── jest.config.js
│   └── .env
├── docker-compose.yml
├── Dockerfile
├── SCHEMA_RELATIONNEL.md                # Documentation du schéma
├── Node Soufiant API.postman_collection.json # Collection Postman
└── README.md
```

---

## 🔌 API Endpoints

### 🔐 Authentification (`/api/auth`)

```
POST   /api/auth/register          Créer un nouvel utilisateur
POST   /api/auth/login             Authentifier un utilisateur
POST   /api/auth/logout            Déconnecter l'utilisateur
```

**Exemple - Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice_dev",
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

**Exemple - Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice_dev",
    "password": "SecurePass123"
  }'
```

### 👥 Utilisateurs (`/api/users`)

```
GET    /api/users                  Lister tous les utilisateurs (auth req)
GET    /api/users/:id              Récupérer un utilisateur (auth req)
DELETE /api/users/:id              Supprimer un utilisateur (auth req)
```

### 📝 Profils (`/api/profiles`)

```
GET    /api/profiles               Lister tous les profils
POST   /api/profiles               Créer un profil (auth req)
GET    /api/profiles/:id           Récupérer un profil
PUT    /api/profiles/:id           Mettre à jour un profil (auth req)
DELETE /api/profiles/:id           Supprimer un profil (auth req)
```

### 📄 Articles/Posts (`/api/posts`)

```
GET    /api/posts                  Lister tous les articles
POST   /api/posts                  Créer un article (auth req)
GET    /api/posts/:id              Récupérer un article
PUT    /api/posts/:id              Mettre à jour un article (auth req)
DELETE /api/posts/:id              Supprimer un article (auth req)
```

**Statuts disponibles:** `draft` | `published` | `archived`

### 💬 Commentaires (`/api/comments`)

```
GET    /api/comments               Lister les commentaires
POST   /api/comments               Créer un commentaire (auth req)
GET    /api/comments/:id           Récupérer un commentaire
PUT    /api/comments/:id           Mettre à jour un commentaire (auth req)
DELETE /api/comments/:id           Supprimer un commentaire (auth req)
```

### 🔑 Rôles (`/api/roles`)

```
GET    /api/roles                  Lister tous les rôles
POST   /api/roles                  Créer un rôle (admin req)
GET    /api/roles/:id              Récupérer un rôle
PUT    /api/roles/:id              Mettre à jour un rôle (admin req)
DELETE /api/roles/:id              Supprimer un rôle (admin req)
```

**Rôles disponibles:** `admin` | `moderator` | `editor` | `user`

### 🎯 Permissions (`/api/permissions`)

```
GET    /api/permissions            Lister toutes les permissions
POST   /api/permissions            Créer une permission (admin req)
GET    /api/permissions/:id        Récupérer une permission
PUT    /api/permissions/:id        Mettre à jour une permission (admin req)
DELETE /api/permissions/:id        Supprimer une permission (admin req)
```

### 🔗 Associations Utilisateur-Rôle (`/api/user-roles`)

```
GET    /api/user-roles             Lister toutes les associations
GET    /api/user-roles/user/:userId   Récupérer les rôles d'un utilisateur
POST   /api/user-roles             Assigner un rôle à un utilisateur (admin req)
DELETE /api/user-roles/:userId/:roleId  Retirer un rôle (admin req)
```

### 🔗 Associations Rôle-Permission (`/api/role-permissions`)

```
GET    /api/role-permissions       Lister toutes les associations
GET    /api/role-permissions/role/:roleId  Récupérer permissions du rôle
POST   /api/role-permissions       Assigner une permission à un rôle (admin req)
DELETE /api/role-permissions/:roleId/:permissionId  Retirer permission (admin req)
```

---

## 🗄️ Base de données

### Schéma relationnel

Consultez [SCHEMA_RELATIONNEL.md](./SCHEMA_RELATIONNEL.md) pour le diagramme DBML complet.

### Tables principales

| Table | Description |
|-------|-------------|
| **users** | Utilisateurs du système (username, email, password, token) |
| **profiles** | Informations personnelles (bio, phone, address, birthdate) |
| **posts** | Articles/contenu (title, slug, content, status) |
| **post_comments** | Commentaires sur les articles |
| **roles** | Définition des rôles (admin, moderator, editor, user) |
| **permissions** | Définition des permissions granulaires |
| **user_roles** | Association M:N entre users et roles |
| **role_permissions** | Association M:N entre roles et permissions |

### Statuts des articles

- `draft`: Article non publié
- `published`: Article en ligne
- `archived`: Article archivé

---

## 🔐 Authentification

### JWT Token

L'API utilise **JWT (JSON Web Token)** pour l'authentification:

```javascript
// Token créé après login
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Durée d'expiration:** 1 heure

### Headers requis

```bash
Authorization: Bearer {votre_token_ici}
Content-Type: application/json
```

---

## 🌱 Seeders

Initialiser la base de données avec des données de test:

```bash
# Tous les seeders
docker compose run serve_backend npx sequelize-cli db:seed:all --seeders-path ./src/seeders

# Un seeder spécifique
docker compose run serve_backend npx sequelize-cli db:seed --seed 20260108-001-seed-roles.js --seeders-path ./src/seeders
```

### Données de test incluses

**6 utilisateurs:**
- `admin` / `admin123` - Administrateur
- `alice_dev` / `user123` - Développeuse (Éditrice)
- `bob_writer` / `user123` - Écrivain (Éditeur)
- `carol_tech` / `user123` - Tech Expert (Modératrice)
- `david_creator` / `user123` - Créateur (Éditeur)
- `emma_blogger` / `user123` - Blogueuse (Utilisatrice)

**7 articles** avec commentaires multiples  
**4 rôles** avec permissions associées  
**15 permissions** granulaires

---

## 🧪 Tests

### Exécuter les tests

```bash
# Tous les tests
docker compose run serve_backend npm test

# Mode watch (rechargement automatique)
docker compose run serve_backend npm run test:watch

# Avec couverture
docker compose run serve_backend npm run test:coverage
```

### Tests inclus

- `userController.test.js` - Gestion des utilisateurs
- `postController.test.js` - Gestion des articles
- `profileController.test.js` - Gestion des profils
- `commentController.test.js` - Gestion des commentaires
- `models.test.js` - Validations des modèles

---

## 📮 Postman Collection

Une collection Postman complète est fournie pour tester l'API:

**Fichier:** `Node Soufiant API.postman_collection.json`

### Importer dans Postman

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier JSON
4. Configurer les variables d'environnement:
   - `base_url`: `http://localhost:3000`
   - `auth_token`: Sera défini automatiquement après login

### Structure de la collection

- 🔐 **Authentication** - Login, Register, Logout
- 👥 **Users** - CRUD des utilisateurs
- 📝 **Profiles** - CRUD des profils
- 📄 **Posts** - CRUD des articles
- 💬 **Comments** - CRUD des commentaires
- 🔑 **Roles** - CRUD des rôles
- 🎯 **Permissions** - CRUD des permissions
- 🔗 **User-Roles** - Gestion des associations
- 🔗 **Role-Permissions** - Gestion des permissions

---

## 📊 Migrations

Les migrations Sequelize gèrent le versioning du schéma:

```bash
# Exécuter les migrations
docker compose run serve_backend npx sequelize-cli db:migrate --migrations-path ./src/migrations

# Annuler la dernière migration
docker compose run serve_backend npx sequelize-cli db:migrate:undo

# Annuler toutes les migrations
docker compose run serve_backend npx sequelize-cli db:migrate:undo:all
```

---

## 📞 Support

Pour toute question ou problème:

1. Vérifier les logs: `docker-compose logs serve_backend`
2. Consulter [SCHEMA_RELATIONNEL.md](./SCHEMA_RELATIONNEL.md)
3. Tester avec la collection Postman

---

## 📄 Licence

ISC

---

**Dernière mise à jour:** 8 janvier 2026  
**Auteur:** Quentin  
**Statut:** ✅ Production-ready
