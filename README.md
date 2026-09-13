# ChâTop - Portail de Location Saisonnière

Application full-stack TypeScript pour mettre en relation locataires et propriétaires dans une zone touristique.

## 📋 Contexte du projet

Ce repository contient le **front-end React** de l'application ChâTop ainsi que les **ressources nécessaires** pour développer le back-end NestJS.

Votre mission : **Implémenter l'API REST avec NestJS** qui remplacera l'API mockée fournie.

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 22 LTS ou supérieur
- **npm** (inclus avec Node.js)
- **MySQL** 8.0+ (ou MariaDB 10.5+)
- **Mockoon** Desktop (pour simuler l'API durant le développement front-end)

### Installation

#### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd LDJS-Mod-lisez-et-impl-mentez-le-back-end-en-utilisant-du-code-NestJS-maintenable
```

#### 2. Installer et lancer le front-end React

```bash
cd frontend
npm install
npm run dev
```

L'application front-end sera accessible sur [http://localhost:5173](http://localhost:5173)

#### 3. Configurer Mockoon

1. Télécharger et installer Mockoon : https://mockoon.com/download/
2. Ouvrir Mockoon
3. Importer l'environnement : `File > Open environment`
4. Sélectionner le fichier : `ressources/mockoon/chatop-api.json`
5. Démarrer le serveur Mock (clic sur le bouton Play)

L'API mockée sera accessible sur [http://localhost:3001](http://localhost:3001)

#### 4. Créer la base de données MySQL

```bash
mysql -u root -p < ressources/sql/schema.sql
```

Ou via MySQL Workbench / DBeaver :

1. Ouvrir le fichier `ressources/sql/schema.sql`
2. Exécuter le script

#### 3. Installer et lancer le back-end NestJS

## Installation

Depuis le dossier `backend` :

```bash
npm install
```

## Configuration

Créer un fichier `.env` à partir du fichier `.env.example`.

Exemple :

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/chatop_db"
JWT_SECRET="your-secret-key"
PORT=3001
```

Le fichier `.env` contient les vraies informations de connexion et ne doit pas être versionné.

## Base de données -> Prisma

Une fois la base créée, Prisma peut récupérer sa structure avec :

```bash
npx prisma db pull
```

Puis générer le client Prisma :

```bash
npx prisma generate
```

## Lancer le backend

En développement :

```bash
npm run start:dev
```

L'API est ensuite disponible sur :

```text
http://localhost:3001
```

## Documentation Swagger

La documentation de l'API est accessible ici :

```text
http://localhost:3001/api-docs
```

Les routes sont protégées par JWT, sauf :

- la création de compte ;
- la connexion ;
- la documentation Swagger.

Pour tester une route protégée dans Swagger :

1. utiliser `POST /api/auth/login` ;
2. récupérer le token retourné ;
3. cliquer sur `Authorize` ;
4. coller uniquement le JWT ;
5. lancer ensuite les routes protégées.

## Routes principales

### Authentification

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Locations

```text
GET  /api/rentals
GET  /api/rentals/:id
POST /api/rentals
PUT  /api/rentals/:id
```

### Utilisateurs

```text
GET /api/user/:id
```

### Messages

```text
POST /api/messages
```

## Images

Une image est obligatoire lors de la création d'une location.

Les fichiers sont enregistrés sur le serveur dans :

```text
/uploads
```

Formats acceptés :

- JPEG
- PNG
- WEBP

Taille maximale :

```text
5 Mo
```

Les fichiers reçoivent un nom unique avant leur enregistrement, puis seule l'URL de l'image est stockée en base de données.

## Architecture

Le backend suit une organisation classique NestJS :

```text
Requête HTTP
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
MySQL
```

Les rôles sont volontairement séparés :

- **Controller** : reçoit les requêtes HTTP ;
- **Service** : contient la logique métier ;
- **Repository** : gère les accès à la base avec Prisma ;
- **DTO** : valident et décrivent les données échangées ;
- **Module** : relie les différents éléments entre eux.

## Sécurité

Quelques points mis en place dans le projet :

- mots de passe hashés avec bcrypt ;
- authentification avec JWT ;
- routes protégées globalement avec un Guard NestJS ;
- données sensibles stockées dans `.env` ;
- mot de passe utilisateur non renvoyé dans les réponses API ;
- contrôle du type et de la taille des images envoyées ;
- validation globale des DTO avec `ValidationPipe`.

## Build

Pour vérifier que le projet compile correctement :

```bash
npm run build
```

## 📚 Ressources

### Documentation officielle

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Passport JWT Strategy](https://docs.nestjs.com/security/authentication#jwt-functionality)
- [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)

### Outils

- [Mockoon](https://mockoon.com/) - Mock API server
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Database GUI
- [Prisma Studio](https://www.prisma.io/studio) - Database browser
- [Postman](https://www.postman.com/) - API testing

**Version** : 1.0.0
**Date** : Septembre 2026
