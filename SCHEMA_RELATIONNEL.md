# Schémas Relationnels - Base de Données

## Diagramme DBDiagram.io

```dbml
Enum post_status {
  draft
  published
  archived
}

Table users {
  id int [pk, increment]
  username varchar [not null, unique]
  email varchar [not null, unique]
  password varchar [not null]
  token text
  created_at datetime [default: `now()`, not null]
  updated_at datetime
}

Table profiles {
  id int [pk, increment]
  user_id int [ref: - users.id, unique]
  first_name varchar
  last_name varchar
  birthdate date
  phone varchar
  address varchar
  bio text
  created_at datetime [default: `now()`, not null]
  updated_at datetime
}

Table posts {
  id int [pk, increment]
  user_id int [ref: > users.id]
  title varchar [not null]
  slug varchar [unique]
  content text
  status post_status [default: 'draft']
  created_at datetime [default: `now()`, not null]
  updated_at datetime
}

Table post_comments {
  id int [pk, increment]
  post_id int [ref: > posts.id]
  user_id int [ref: > users.id]
  content text [not null]
  created_at datetime [default: `now()`, not null]
  updated_at datetime
}

Table roles {
  id int [pk, increment]
  name varchar [not null, unique]
  description varchar
  created_at datetime [default: `now()`, not null]
  updated_at datetime
}

Table permissions {
  id int [pk, increment]
  name varchar [not null, unique]
  description varchar
  created_at datetime [default: `now()`, not null]
  updated_at datetime
}

Table user_roles {
  user_id int [ref: > users.id]
  role_id int [ref: > roles.id]
  assigned_at datetime [default: `now()`, not null]
  
  indexes {
    (user_id, role_id) [pk]
  }
}

Table role_permissions {
  role_id int [ref: > roles.id]
  permission_id int [ref: > permissions.id]
  
  indexes {
    (role_id, permission_id) [pk]
  }
}
```

---

## Tables Détaillées

### Table: `users`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique de l'utilisateur |
| `username` | VARCHAR(255) | NOT NULL, UNIQUE | Nom d'utilisateur unique |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email unique de l'utilisateur |
| `password` | VARCHAR(255) | NOT NULL | Hash du mot de passe |
| `token` | TEXT | NULL | Token d'authentification JWT |
| `created_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date de création du compte |
| `updated_at` | DATETIME | NULL | Date de dernière modification |

**Clés Primaires:** `id`  
**Contraintes Uniques:** `username`, `email`

---

### Table: `profiles`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique du profil |
| `user_id` | INTEGER | FK → users(id), NOT NULL, UNIQUE | Référence à l'utilisateur |
| `first_name` | VARCHAR(255) | NULL | Prénom |
| `last_name` | VARCHAR(255) | NULL | Nom de famille |
| `birthdate` | DATE | NULL | Date de naissance |
| `phone` | VARCHAR(50) | NULL | Numéro de téléphone |
| `address` | VARCHAR(255) | NULL | Adresse |
| `bio` | TEXT | NULL | Biographie de l'utilisateur |
| `created_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date de création du profil |
| `updated_at` | DATETIME | NULL | Date de dernière modification |

**Clés Primaires:** `id`  
**Clés Étrangères:** `user_id` → `users(id)` (UNIQUE, ONE-TO-ONE)

---

### Table: `posts`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique du post |
| `user_id` | INTEGER | FK → users(id) | Référence à l'auteur du post |
| `title` | VARCHAR(255) | NOT NULL | Titre du post |
| `slug` | VARCHAR(255) | UNIQUE | Slug pour l'URL |
| `content` | TEXT | NULL | Contenu du post |
| `status` | ENUM('draft', 'published', 'archived') | DEFAULT: 'draft' | Statut du post |
| `created_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date de création du post |
| `updated_at` | DATETIME | NULL | Date de dernière modification |

**Clés Primaires:** `id`  
**Clés Étrangères:** `user_id` → `users(id)` (ONE-TO-MANY)  
**Contraintes Uniques:** `slug`

---

### Table: `post_comments`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique du commentaire |
| `post_id` | INTEGER | FK → posts(id), NOT NULL | Référence au post |
| `user_id` | INTEGER | FK → users(id), NOT NULL | Référence à l'auteur du commentaire |
| `content` | TEXT | NOT NULL | Contenu du commentaire |
| `created_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date de création du commentaire |
| `updated_at` | DATETIME | NULL | Date de dernière modification |

**Clés Primaires:** `id`  
**Clés Étrangères:** `post_id` → `posts(id)` (CASCADE), `user_id` → `users(id)` (CASCADE)

---

### Table: `roles`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique du rôle |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | Nom du rôle |
| `description` | VARCHAR(255) | NULL | Description du rôle |
| `created_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date de création du rôle |
| `updated_at` | DATETIME | NULL | Date de dernière modification |

**Clés Primaires:** `id`  
**Contraintes Uniques:** `name`

---

### Table: `permissions`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique de la permission |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | Nom de la permission |
| `description` | VARCHAR(255) | NULL | Description de la permission |
| `created_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date de création de la permission |
| `updated_at` | DATETIME | NULL | Date de dernière modification |

**Clés Primaires:** `id`  
**Contraintes Uniques:** `name`

---

### Table: `user_roles` (Pivot)

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `user_id` | INTEGER | PK, FK → users(id) | Référence à l'utilisateur |
| `role_id` | INTEGER | PK, FK → roles(id) | Référence au rôle |
| `assigned_at` | DATETIME | NOT NULL, DEFAULT: NOW() | Date d'assignation du rôle |

**Clés Primaires Composées:** (user_id, role_id)  
**Clés Étrangères:** `user_id` → `users(id)` (CASCADE), `role_id` → `roles(id)` (CASCADE)

**Clés Primaires:** `(user_id, role_id)`  
**Clés Étrangères:** `user_id` → `users(id)` (CASCADE), `role_id` → `roles(id)` (CASCADE)

---

### Table: `role_permissions` (Pivot)

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `role_id` | INTEGER | PK, FK → roles(id), NOT NULL | Référence au rôle |
| `permission_id` | INTEGER | PK, FK → permissions(id), NOT NULL | Référence à la permission |

**Clés Primaires:** `(role_id, permission_id)`  
**Clés Étrangères:** `role_id` → `roles(id)` (CASCADE), `permission_id` → `permissions(id)` (CASCADE)

---

## Relations

| De | À | Type | Description |
|---------|---------|---------|---------|
| `users` | `posts` | 1..N | Un utilisateur peut avoir plusieurs posts |
| `users` | `profiles` | 1..1 | Un utilisateur a un profil unique |
| `posts` | `post_comments` | 1..N | Un post peut avoir plusieurs commentaires |
| `users` | `post_comments` | 1..N | Un utilisateur peut faire plusieurs commentaires |
| `users` | `user_roles` | 1..N | Un utilisateur peut avoir plusieurs rôles |
| `roles` | `user_roles` | 1..N | Un rôle peut être assigné à plusieurs utilisateurs |
| `roles` | `role_permissions` | 1..N | Un rôle peut avoir plusieurs permissions |
| `permissions` | `role_permissions` | 1..N | Une permission peut être assignée à plusieurs rôles |

---

## Code SQL de Création

```sql
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS listra;
USE listra;

-- Table posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
) ENGINE=InnoDB;

-- Table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usernameHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    post_id INT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT fk_users_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Table profiles
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    birthdate DATE,
    phone VARCHAR(50),
    address VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table post_comments
CREATE TABLE post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
) ENGINE=InnoDB;

-- Table permissions
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
) ENGINE=InnoDB;

-- Table user_roles (table pivot)
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at DATETIME NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table role_permissions (table pivot)
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

---

## Notes d'Intégrité Référentielle

- **ON DELETE:** CASCADE (Si un utilisateur est supprimé, tous ses produits seront supprimés)
- **ON UPDATE:** CASCADE (Si l'ID d'un utilisateur change, les produits seront mis à jour)
- **Intégrité:** Les produits orphelins (sans utilisateur valide) ne peuvent pas exister

---

## Normalisation

- **Forme Normale:** 3NF (Troisième Forme Normale)
- **Sans Anomalies:** Absence d'anomalies de modification, suppression et insertion
- **Dépendances Fonctionnelles:** Respectées
