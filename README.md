# Dom at Home: Arcade

## Installation des dépendances
```
npm install
```

## Compiler pour le développement
```
npm run serve
```

## Mise en production
```
npm run build
```

Puis envoyer le contenu du dossier `dist` sur le serveur

## Interpréter les données du joytick et du bouton

Lancer le script `joystick.js`:
```
node joystick.js
```

Il transforme les entrées du joystick et du bouton en événements clavier: gauche, haut, droite, bas et le bouton appuie sur la barre d'espace.
