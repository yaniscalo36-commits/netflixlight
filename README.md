# NetflixLight

NetflixLight est une application web simple permettant de rechercher des
films grâce à l'API TMDB (The Movie Database). Le projet utilise Node.js
avec Express pour le backend, SQLite pour la gestion des utilisateurs et
un frontend HTML/CSS/JS sans framework.

## Fonctionnalités

-   Recherche de films via l'API TMDB
-   Affichage des films tendances
-   Page de connexion utilisateur
-   Inscription et connexion des utilisateurs
-   Stockage des utilisateurs dans une base de données SQLite
-   Architecture backend structurée (routes, controllers, database)

## Technologies utilisées

### Backend

-   Node.js
-   Express
-   SQLite3
-   Dotenv

### Frontend

-   HTML
-   CSS
-   JavaScript (vanilla)

### API externe

-   The Movie Database (TMDB)

## Structure du projet

    netflixlight
    │
    ├── server.js
    ├── package.json
    ├── .env
    │
    ├── src
    │   ├── controllers
    │   │   ├── users.controller.js
    │   │   └── movies.controller.js
    │   │
    │   ├── routes
    │   │   ├── users.routes.js
    │   │   └── movies.routes.js
    │   │
    │   └── data
    │       └── database.js
    │
    └── web
        ├── static
        │   ├── css
        │   └── js
    │
        └── templates
            ├── index.html
            └── authentification.html

## Installation

### 1. Cloner le projet

    git clone https://github.com/yaniscalo36-commits/netflixlight.git
    cd netflixlight

### 2. Installer les dépendances

    npm install

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

    TMDB_ACCESS_TOKEN=VOTRE_TOKEN_TMDB

### 4. Lancer le serveur

    npm run start

Le serveur sera accessible à l'adresse :

    http://localhost:3000

## API du backend

### Authentification

Inscription : POST /api/users/register

Connexion : POST /api/users/login

### Films

Films tendances : GET /api/movies/trending

Recherche de films : GET /api/movies/search?q=nom_du_film

Détails d'un film : GET /api/movies/:id

## Base de données

Le projet utilise SQLite. La base de données est automatiquement créée
au premier lancement dans :

src/data/app.db

Table principale : users

Colonnes : - id - username - email - password_hash

## Notes

-   Les mots de passe sont stockés sous forme hachée.
-   Les données utilisateurs ne sont pas exposées publiquement.
-   L'API TMDB est appelée uniquement côté backend pour protéger la clé
    d'accès.

## Auteur

Projet réalisé dans le cadre d'un projet scolaire.