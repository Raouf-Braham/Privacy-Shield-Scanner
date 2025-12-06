# 🛡️ Privacy Shield Scanner

<div align="center">

![Privacy Shield Scanner Logo](assets/icons/icon128.png)

**Une extension de navigateur puissante qui analyse la confidentialité et la sécurité des sites web en temps réel.**

[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](https://github.com/Raouf-Braham/Privacy-Shield-Scanner/releases)
[![JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://developer.mozilla.org/fr/docs/Web/JavaScript)

[Fonctionnalités](#-fonctionnalités) • [Installation](#-installation) • [Utilisation](#-utilisation) • [Permissions](#-permissions-expliquées) • [Contribution](#-contribution)

</div>

---

## 📋 Table des Matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Simulation](#-Simulation)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Comment ça marche](#-comment-ça-marche)
- [Permissions expliquées](#-permissions-expliquées)
- [Structure du projet](#-structure-du-projet)
- [Développement](#-développement)
- [Contribution](#-contribution)
- [Licence](#-licence)
- [Contact](#-contact)

---

## 🌟 Aperçu

**Privacy Shield Scanner** est une extension de navigateur Chrome/Edge qui vous aide à comprendre comment les sites web suivent votre activité en ligne.  Elle analyse les pages web en temps réel pour détecter :

- 👁️ **Scripts de tracking** (Google Analytics, Facebook Pixel, etc.)
- 🔍 **Techniques de fingerprinting** du navigateur
- 🌐 **Domaines tiers** qui chargent des ressources
- 🍪 **Cookies** et leurs utilisations
- 🔒 **Problèmes de sécurité** (HTTPS, contenu mixte)

Obtenez instantanément un **score de confidentialité** de 0 à 100 et des recommandations concrètes pour protéger votre vie privée en ligne.

---

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales

| Fonctionnalité | Description |
|----------------|-------------|
| **Analyse en temps réel** | Analyse automatiquement les pages pendant votre navigation |
| **Score de confidentialité** | Score de 0-100 avec note (A+ à F) |
| **Détection des trackers** | Identifie plus de 50 services de tracking courants |
| **Détection du fingerprinting** | Détecte le fingerprinting canvas, WebGL, audio |
| **Analyse de sécurité** | Vérifie HTTPS et le contenu mixte |
| **Rapports détaillés** | Exportez les résultats vers le presse-papiers |

### 🎨 Expérience Utilisateur

- 🌓 **Thème Sombre/Clair** - S'adapte aux préférences système
- ⚡ **Rapide et Léger** - Impact minimal sur les performances
- 📱 **Interface moderne** - Design épuré et intuitif
- 🔔 **Notifications badge** - Score affiché sur l'icône de l'extension
- 📊 **Détails en accordéon** - Listes extensibles pour plus d'informations

---

## 📸 Simulation

<video src="https://github.com/user-attachments/assets/7303f62c-d85c-4972-a4b3-7d73ae2bf926" controls></video>



### Exemples de Scores

| Score | Note | Couleur | Signification |
|-------|------|---------|---------------|
| 90-100 | A+ | 🟢 Vert | Excellente confidentialité |
| 80-89 | A | 🟢 Vert | Très bon |
| 70-79 | B | 🟡 Jaune-Vert | Bon |
| 60-69 | C | 🟡 Jaune | Modéré |
| 50-59 | D | 🟠 Orange | Faible |
| 30-49 | E | 🔴 Rouge | Mauvais |
| 0-29 | F | 🔴 Rouge foncé | Critique |

### Détail des Trackers

```
┌─────────────────────────────────────┐
│ 👁️ Trackers Détectés           3   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ google-analytics.com  ANALYTICS │ │
│ │ facebook.net          SOCIAL    │ │
│ │ doubleclick.net       PUB       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🚀 Installation

### Méthode 1 : Chargement Manuel (Mode Développeur)

#### Étape 1 : Télécharger le code source

```bash
git clone https://github.com/Raouf-Braham/Privacy-Shield-Scanner.git
```

Ou téléchargez et extrayez le fichier ZIP depuis GitHub.

#### Étape 2 : Ouvrir les Extensions Chrome

- Ouvrez Chrome/Edge
- Tapez `chrome://extensions/` dans la barre d'adresse
- Ou allez dans Menu → Plus d'outils → Extensions

#### Étape 3 : Activer le Mode Développeur

- Activez le bouton "Mode développeur" en haut à droite de la page

#### Étape 4 : Charger l'extension

- Cliquez sur "Charger l'extension non empaquetée"
- Sélectionnez le dossier `Privacy-Shield-Scanner`
- L'icône 🛡️ devrait apparaître dans votre barre d'outils

#### Étape 5 : Épingler l'extension (recommandé)

- Cliquez sur l'icône puzzle 🧩 dans la barre d'outils
- Cliquez sur l'épingle 📌 à côté de "Privacy Shield Scanner"

### Méthode 2 : Chrome Web Store (Bientôt disponible)

```
🚧 L'extension sera bientôt disponible sur le Chrome Web Store ! 
```

---

## 📖 Utilisation

### Utilisation de Base

1. **Naviguez** vers n'importe quel site web
2. **Attendez** 1-2 secondes que l'analyse se termine
3. **Cliquez** sur l'icône 🛡️ dans la barre d'outils
4. **Consultez** votre score de confidentialité et les détails

### Comprendre les Résultats

#### Score de Confidentialité
- **90-100 (A+)** : Excellent !  Le site respecte votre vie privée
- **70-89 (A/B)** : Bon, quelques trackers présents
- **50-69 (C/D)** : Modéré, plusieurs trackers détectés
- **0-49 (E/F)** : Mauvais, nombreux trackers et risques

#### Sections Détaillées

| Section | Description |
|---------|-------------|
| **Trackers** | Liste des scripts de suivi détectés |
| **Fingerprinting** | Techniques d'identification du navigateur |
| **Domaines Tiers** | Ressources chargées depuis d'autres sites |
| **Sécurité** | État HTTPS et contenu mixte |

### Actions Disponibles

- **🔄 Rescanner** : Relance une analyse de la page
- **📋 Copier Rapport** : Copie un rapport détaillé dans le presse-papiers

---

## ⚙️ Comment ça marche

### Processus d'Analyse

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Page      │     │   Script    │     │   Service   │
│   Chargée   │ ──▶ │   Analyse   │ ──▶ │   Worker    │
│             │     │   le DOM    │     │   Stocke    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Détecte:   │     │   Badge     │
                    │  - Trackers │     │   Affiche   │
                    │  - Scripts  │     │   le Score  │
                    │  - Domaines │     │             │
                    └─────────────┘     └─────────────┘
```

### Méthodes de Détection

#### 1. Détection des Trackers

L'extension recherche des patterns connus dans :
- Sources des scripts (`<script src="...">`)
- Pixels de tracking (`<img src="... ">`)
- Iframes (`<iframe src="...">`)
- Contenu de la page

**Trackers détectés (liste non exhaustive) :**

| Catégorie | Exemples |
|-----------|----------|
| **Analytics** | Google Analytics, Mixpanel, Amplitude, Hotjar |
| **Publicité** | DoubleClick, Criteo, AdRoll, Taboola |
| **Réseaux sociaux** | Facebook Pixel, Twitter, LinkedIn, TikTok |
| **Autres** | Segment, FullStory, NewRelic, Optimizely |

#### 2.  Détection du Fingerprinting

Analyse les scripts inline pour détecter :

| Technique | Description |
|-----------|-------------|
| `canvas. toDataURL()` | Fingerprinting Canvas |
| `WebGLRenderingContext` | Fingerprinting WebGL |
| `AudioContext` | Fingerprinting Audio |
| `navigator.plugins` | Énumération des plugins |
| `RTCPeerConnection` | Fuites WebRTC |
| `getBattery` | État de la batterie |

#### 3. Analyse de Sécurité

- **HTTPS** : Vérifie si la connexion est sécurisée
- **Contenu Mixte** : Détecte les ressources HTTP sur pages HTTPS

#### 4. Analyse des Tiers

- Compte les domaines externes
- Liste toutes les ressources tierces

### Calcul du Score

```javascript
Score = 100
  - (trackers × 3)              // Maximum -25 points
  - (fingerprinting × 5)        // Maximum -25 points
  - (pas de HTTPS ?  15 : 0)     // -15 si non sécurisé
  - (contenu mixte ? 10 : 0)    // -10 si détecté
  - (domaines tiers × 0.5)      // Maximum -15 points
  - (cookies × 1)               // Maximum -10 points
```

**Exemple :**
```
Site avec :
- 5 trackers     → -15 points
- 2 fingerprint  → -10 points
- HTTPS          → 0 points
- 20 domaines    → -10 points
- 8 cookies      → -8 points

Score final : 100 - 15 - 10 - 0 - 10 - 8 = 57/100 (Note D)
```

---

## 🔐 Permissions Expliquées

L'extension demande les permissions suivantes :

| Permission | Pourquoi c'est nécessaire |
|------------|---------------------------|
| `activeTab` | Accéder à l'onglet actif pour analyser son contenu |
| `storage` | Sauvegarder vos préférences et l'historique des analyses |
| `scripting` | Injecter le script d'analyse dans les pages |
| `<all_urls>` | Analyser n'importe quel site web que vous visitez |

### Engagement de Confidentialité

✅ **Ce que nous NE faisons PAS :**
- Collecter ou transmettre vos données de navigation
- Stocker des informations sur des serveurs externes
- Partager des données avec des tiers
- Suivre votre historique de navigation

✅ **Toute l'analyse se fait localement dans votre navigateur.**

---

## 📁 Structure du Projet

```
Privacy-Shield-Scanner/
│
├── 📄 manifest.json          # Configuration de l'extension
├── 📄 README.md              # Ce fichier
├── 📄 LICENSE                # Licence MIT
├── 📄 PRIVACY. md             # Politique de confidentialité
├── 📄 CONTRIBUTING.md        # Guide de contribution
│
├── 📁 assets/
│   └── 📁 icons/
│       ├── icon16.png        # Icône barre d'outils
│       ├── icon32.png        # Petite icône
│       ├── icon48.png        # Icône moyenne
│       └── icon128.png       # Grande icône
│
├── 📁 src/
│   ├── 📁 background/
│   │   └── service-worker.js # Service worker en arrière-plan
│   │
│   ├── 📁 content/
│   │   └── content-script.js # Script d'analyse des pages
│   │
│   ├── 📁 popup/
│   │   ├── popup.html        # Structure de l'interface
│   │   ├── popup.css         # Styles de l'interface
│   │   └── popup.js          # Logique de l'interface
│   │
│   └── 📁 options/
│       ├── options.html      # Page des paramètres
│       ├── options.css       # Styles des paramètres
│       └── options.js        # Logique des paramètres
│
└── 📁 docs/
    └── screenshots/          # Images de documentation
```

---

## 🛠️ Développement

### Prérequis

- Navigateur Google Chrome ou Microsoft Edge
- Connaissances de base en JavaScript, HTML, CSS
- Éditeur de texte (VS Code recommandé)

### Installation pour le Développement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/Raouf-Braham/Privacy-Shield-Scanner.git
   cd Privacy-Shield-Scanner
   ```

2. **Charger dans Chrome**
   - Aller à `chrome://extensions/`
   - Activer "Mode développeur"
   - Cliquer sur "Charger l'extension non empaquetée"
   - Sélectionner le dossier du projet

3. **Faire des modifications**
   - Modifier les fichiers dans le dossier `src/`
   - Cliquer sur le bouton rafraîchir 🔄 sur la carte de l'extension
   - Recharger la page de test

### Débogage

#### Console du Service Worker
1. Aller à `chrome://extensions/`
2. Trouver Privacy Shield Scanner
3. Cliquer sur le lien "service worker"
4. Vérifier l'onglet Console pour les logs

#### Console du Popup
1. Clic droit sur l'icône de l'extension
2. Sélectionner "Inspecter la fenêtre contextuelle"
3. Vérifier l'onglet Console

#### Console du Content Script
1. Ouvrir n'importe quelle page web
2. Appuyer sur F12 → Onglet Console
3. Chercher les messages `[Privacy Shield]`

### Ajouter de Nouveaux Trackers

Modifier `src/content/content-script. js` :

```javascript
const TRACKER_PATTERNS = [
  // Ajouter de nouveaux patterns ici
  'nouveau-tracker. com',
  'autre-tracker.net/pixel',
  // ... 
];
```

### Structure des Fichiers Principaux

#### manifest.json
```json
{
  "manifest_version": 3,
  "name": "Privacy Shield Scanner",
  "version": "1.0. 0",
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "src/background/service-worker.js"
  },
  "content_scripts": [{
    "matches": ["http://*/*", "https://*/*"],
    "js": ["src/content/content-script.js"]
  }],
  "action": {
    "default_popup": "src/popup/popup. html"
  }
}
```

---

## 🤝 Contribution

Les contributions sont les bienvenues !  Veuillez lire notre [Guide de Contribution](CONTRIBUTING.md) d'abord.

### Comment Contribuer

1. **Forker** le dépôt
2. **Créer** une branche pour votre fonctionnalité
   ```bash
   git checkout -b fonctionnalite/ma-super-fonctionnalite
   ```
3. **Commiter** vos changements
   ```bash
   git commit -m "Ajout: description de vos changements"
   ```
4. **Pousser** vers la branche
   ```bash
   git push origin fonctionnalite/ma-super-fonctionnalite
   ```
5. **Ouvrir** une Pull Request

### Idées de Contributions

- [ ] Ajouter plus de patterns de trackers
- [ ] Améliorer la détection du fingerprinting
- [ ] Ajouter un scan de l'historique du navigateur
- [ ] Créer une version Firefox
- [ ] Ajouter l'export de données (JSON/CSV)
- [ ] Implémenter une fonctionnalité de blocage
- [ ] Ajouter l'internationalisation (i18n)
- [ ] Créer des tests automatisés

### Standards de Code

- Utiliser 2 espaces pour l'indentation
- Utiliser des noms de variables explicites
- Ajouter des commentaires pour la logique complexe
- Suivre les patterns de code existants

---

## 📜 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails. 

```
MIT License

Copyright (c) 2024 Raouf Braham

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
```

---

## ❓ FAQ (Foire Aux Questions)

### L'extension collecte-t-elle mes données ?

**Non. ** Toute l'analyse se fait localement dans votre navigateur. Aucune donnée n'est envoyée vers des serveurs externes.

### Pourquoi le score est-il différent à chaque scan ?

Le contenu des pages peut changer dynamiquement (publicités, scripts chargés à la demande).  Cela peut affecter légèrement le score.

### L'extension ralentit-elle ma navigation ?

**Non.** L'analyse est très rapide et se fait après le chargement de la page.  L'impact sur les performances est négligeable.

### Puis-je utiliser l'extension sur Firefox ? 

Actuellement, l'extension est conçue pour Chrome/Edge. Une version Firefox est prévue dans les futures mises à jour.

### Comment signaler un bug ?

Ouvrez une issue sur notre [dépôt GitHub](https://github.com/Raouf-Braham/Privacy-Shield-Scanner/issues) avec :
- Description du problème
- Étapes pour reproduire
- Captures d'écran si possible

---

## 📞 Contact & Support

- **GitHub Issues** : [Signaler un bug](https://github.com/Raouf-Braham/Privacy-Shield-Scanner/issues)
- **GitHub Discussions** : [Questions et discussions](https://github.com/Raouf-Braham/Privacy-Shield-Scanner/discussions)

---

## 🙏 Remerciements

- [Documentation Chrome Extension](https://developer.chrome.com/docs/extensions/)
- [Mozilla WebExtensions](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions)
- Icônes par [Emoji](https://emojipedia.org/)
- Tous les contributeurs du projet

---

## 📊 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| Version | 1.0.0 |
| Taille | < 100 KB |
| Langages | JavaScript, HTML, CSS |
| Licence | MIT |
| Compatibilité | Chrome 88+, Edge 88+ |

---

<div align="center">

**Réalisé avec ❤️ pour la Nuit de l'Info 2024**

⭐ Mettez une étoile à ce dépôt si vous le trouvez utile ! 

[⬆ Retour en haut](#-privacy-shield-scanner)

</div>
