# BiblioTech – Gestion Bibliothèque

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square\&logo=javascript\&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Contexte

L'entreprise BiblioTech est en crise. Un prototype critique nommé `gestion_biblio_source_final.html` a été livré dans un état catastrophique :

* Code illisible
* Non sécurisé
* Impossible à maintenir

Mission : Assainir le projet pour qu’il devienne professionnel, sécuritaire et maintenable, sans ajouter de nouvelles fonctionnalités.

---

## Objectifs

* Assainir la base de code existante.
* Préserver toutes les fonctionnalités :

  * Ajouter, supprimer et rechercher des livres.
  * Réinitialiser la base.
  * Gestion de la persistance via LocalStorage.
* Appliquer des bonnes pratiques de code :

  * Séparation HTML / CSS / JS
  * Fonctions claires et réutilisables
  * Validation des entrées utilisateur

---

## Fonctionnalités

* Ajout de livre : titre, auteur, catégorie, ISBN
* Affichage du tableau : numéro, info livre, catégorie, détails
* Suppression : individuelle ou réinitialisation totale
* Recherche : filtre en temps réel par titre ou auteur
* Persistance des données : via LocalStorage du navigateur

---

## Structure du projet

```
archive/
  └─ gestion_biblio_source_final.html  # Ancien prototype non maintenable

css/
  └─ style.css                         # Styles

js/
  ├─ app.js                            # Logique principale
  └─ storage.js                        # Gestion du stockage local

index.html                              # Nouveau point d'entrée (assaini)
```

---

## Technologies utilisées

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* LocalStorage pour la persistance côté client

---

## Installation & utilisation

1. Cloner le projet :

```bash
git clone https://github.com/votre-utilisateur/0110_Projet_Final_BiblioTech.git
```

2. Ouvrir `index.html` dans un navigateur moderne.

3. Utiliser le formulaire pour :

   * Ajouter un livre
   * Rechercher des livres
   * Supprimer ou réinitialiser la base

Les données sont automatiquement sauvegardées dans LocalStorage.

---

## Bonnes pratiques appliquées

* Code structuré et commenté
* Fonctions modulaires et réutilisables
* Validation simple des entrées utilisateur
* Séparation claire entre styles, scripts et HTML
* Gestion d’erreurs et feedback utilisateur

---

## Workflow pour contribution

1. Forker le dépôt
2. Créer une branche :

```bash
git checkout -b feature/nom-fonctionnalite
```

3. Effectuer les modifications
4. Commit et push :

```bash
git commit -am "Description du changement"
git push origin feature/nom-fonctionnalite
```

5. Créer une Pull Request pour validation

---

## Licence

Ce projet est open-source sous licence MIT.
Vous êtes libre de l'utiliser, de le modifier et de le redistribuer.
