# ChâTop - Portail de location saisonnière

Application full-stack TypeScript permettant de mettre en relation locataires et propriétaires dans une zone touristique.

Le projet contient :

- le front-end React fourni avec le projet ;
- le back-end NestJS développé pour remplacer l'API Mockoon ;
- les ressources nécessaires à la création de la base de données MySQL.

L'API permet de gérer l'authentification, les locations, les utilisateurs et les messages.

---

## 📋 Stack technique

### Front-end

- React 19
- TypeScript
- Vite

### Back-end

- Node.js 22+
- TypeScript
- NestJS 11
- Prisma
- MySQL
- Passport / JWT
- Swagger / OpenAPI

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd LDJS-Mod-lisez-et-impl-mentez-le-back-end-en-utilisant-du-code-NestJS-maintenable
```

---

### 2. Installer le front-end

Depuis la racine du projet :

```bash
cd frontend
npm install
npm run dev
```

Le front-end est ensuite accessible sur :

[http://localhost:5173](http://localhost:5173)

> Le front-end fourni avec le projet n'a pas été modifié.

---

### 3. Créer la base de données MySQL

Depuis la racine du projet, utiliser le script SQL fourni :

```text
ressources/sql/schema.sql
```

Exemple en ligne de commande :

```bash
mysql -u root -p < ressources/sql/schema.sql
```

Le script peut également être exécuté avec un outil comme MySQL Workbench ou DBeaver.

---

### 4. Installer le back-end

Depuis le dossier `backend` :

```bash
npm install
```

---

### 5. Configurer les variables d'environnement

Créer un fichier `.env` à partir du fichier `.env.example`.

Exemple :

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/chatop_db"
JWT_SECRET="your-secret-key"
PORT=3001
```

Le fichier `.env` contient les vraies informations de connexion et ne doit pas être versionné.

---

### 6. Générer le client Prisma

Une fois la base de données créée :

```bash
npx prisma generate
```

Pendant le développement, la commande suivante a également été utilisée pour récupérer la structure de la base existante :

```bash
npx prisma db pull
```

`db pull` permet à Prisma d'introspecter la base de données et de mettre à jour le fichier `schema.prisma`.

---

### 7. Lancer le back-end

En mode développement :

```bash
npm run start:dev
```

L'API est ensuite disponible sur :

[http://localhost:3001](http://localhost:3001)

---

## 🧪 Mockoon

Mockoon a été utilisé au début du projet pour simuler les réponses de l'API avant le développement du back-end NestJS.

Le fichier fourni se trouve dans :

```text
ressources/mockoon/chatop-api.json
```

Pour l'utiliser :

1. ouvrir Mockoon ;
2. importer l'environnement ;
3. sélectionner `ressources/mockoon/chatop-api.json` ;
4. démarrer le serveur Mock.

> Mockoon et le back-end NestJS utilisent tous les deux le port `3001`.  
> Il faut donc arrêter Mockoon avant de lancer l'API NestJS sur ce même port.

---

## 📚 Documentation Swagger

La documentation de l'API est disponible ici :

[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

Les routes sont protégées par JWT, sauf :

- la création de compte ;
- la connexion ;
- la documentation Swagger.

Pour tester une route protégée dans Swagger :

1. utiliser `POST /api/auth/login` ;
2. récupérer le token retourné ;
3. cliquer sur `Authorize` ;
4. coller uniquement le JWT ;
5. tester les routes protégées.

---

## 🔗 Routes principales

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

---

## 🖼️ Gestion des images

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

Chaque fichier reçoit un nom unique avant son enregistrement afin d'éviter les collisions.

Seule l'URL de l'image est enregistrée dans la base de données.

---

## 🏗️ Architecture du back-end

Le projet suit une architecture NestJS organisée par modules.

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

Rôle des principaux éléments :

- **Controller** : reçoit les requêtes HTTP et appelle le service ;
- **Service** : contient la logique métier ;
- **Repository** : gère les accès à la base de données avec Prisma ;
- **DTO** : valident et décrivent les données échangées ;
- **Module** : relie les différents éléments entre eux grâce à l'injection de dépendances.

---

## 🔐 Sécurité

Le back-end met en place plusieurs protections :

- mots de passe hashés avec bcrypt ;
- authentification avec JWT ;
- routes protégées globalement avec un Guard NestJS ;
- variables sensibles stockées dans `.env` ;
- mot de passe utilisateur non renvoyé dans les réponses API ;
- validation globale des DTO avec `ValidationPipe` ;
- contrôle du type des images envoyées ;
- taille des images limitée à 5 Mo ;
- nom de fichier généré automatiquement pour les uploads.

---

## ✅ Vérifier le projet

Pour vérifier que le back-end compile correctement :

```bash
npm run build
```

Pour lancer le back-end en développement :

```bash
npm run start:dev
```

---

## 📚 Ressources utiles

### Documentation officielle

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Passport / JWT avec NestJS](https://docs.nestjs.com/security/authentication)
- [Swagger / OpenAPI avec NestJS](https://docs.nestjs.com/openapi/introduction)

### Outils

- [Mockoon](https://mockoon.com/) - simulation d'API
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - gestion de la base de données
- [Prisma Studio](https://www.prisma.io/studio) - visualisation des données
- [Postman](https://www.postman.com/) - test d'API

---

**Version :** 1.0.0  
**Date :** Septembre 2026
