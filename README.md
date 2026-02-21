# 🎧 NoCopyrightSounds (NCS) Web Widget

[![NPM Version](https://img.shields.io/npm/v/nocopyrightsounds-widget.svg?style=flat-square&color=1DB954)](https://www.npmjs.com/package/nocopyrightsounds-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Un lecteur musical flottant, élégant et hautement personnalisable pour intégrer facilement les musiques libres de droits de **NoCopyrightSounds** à n'importe quel site web. 

Conçu pour les développeurs modernes : léger, persistant entre les changements de pages, et entièrement paramétrable via JavaScript et CSS.

![NCS Widget Preview](https://raw.githubusercontent.com/floriangobin/nocopyrightsounds-widget/main/preview.png) *(Ajoutez une capture d'écran de votre widget dans votre dépôt GitHub et remplacez ce lien plus tard !)*

---

## ✨ Fonctionnalités

* ⚡ **Zéro Latence :** Algorithme de préchargement (buffering) intelligent en arrière-plan pour des transitions instantanées entre les morceaux.
* 💾 **Persistance d'état :** Mémorise la piste en cours, le volume, la progression et l'état d'ouverture du widget d'une page à l'autre via `localStorage`.
* 🎨 **Design Premium :** Support natif des modes clair/sombre, personnalisation des couleurs, et effet **Glassmorphism** (verre dépoli).
* 🎛️ **Contrôles Complets :** Boutons Suivant/Précédent avec historique, contrôle du volume, Mute, et barre de progression cliquable.
* 🎵 **Catalogue Complet :** Navigation aléatoire intelligente parmi les 60+ genres historiques de NCS.
* 👁️ **UI Modulaire :** Possibilité de masquer des éléments (téléchargement, visualizer) pour un rendu minimaliste.

---

## 📦 Installation

### Via NPM (Recommandé pour React, Vue, Angular...)
\`\`\`bash
npm install nocopyrightsounds-widget
\`\`\`

### Via CDN (Pour les sites HTML classiques / Vanilla JS)
\`\`\`html
<script type="module">
  import NCSWidget from 'https://cdn.jsdelivr.net/npm/nocopyrightsounds-widget@latest/src/index.js';
</script>
\`\`\`

---

## 🚀 Utilisation Rapide

### Exemple basique
\`\`\`html
<script type="module">
    import NCSWidget from 'https://cdn.jsdelivr.net/npm/nocopyrightsounds-widget@latest/src/index.js';
    const player = new NCSWidget();
</script>
\`\`\`

### Exemple Avancé (Toutes les options)
\`\`\`javascript
const widget = new NCSWidget({
    position: 'bottom-left', // 'bottom-right', 'top-left', 'top-right'
    offset: '30px',          // Distance par rapport au bord de l'écran
    theme: 'dark',           // 'dark' ou 'light'
    primaryColor: '#9d4edd', // Couleur principale (ex: Violet)
    glassmorphism: true,     // Active l'effet de transparence floutée
    borderRadius: '12px',    // Arrondi de la fenêtre
    fontFamily: "'Courier New', monospace", // Police d'écriture personnalisée
    defaultGenre: '10',      // Démarre sur la House (ID: 10)
    startVolume: 0.3,        // Volume initial à 30%
    hideDownload: true,      // Cache le bouton de téléchargement
    hideVisualizer: false,   // Garde l'animation sonore
    autoOpen: true           // Ouvre le lecteur automatiquement à la 1ère visite
});
\`\`\`

---

## ⚙️ Configuration Détaillée (Options)

| Option | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| \`position\` | String | \`'bottom-right'\` | Position à l'écran (\`bottom-right\`, \`bottom-left\`, \`top-right\`, \`top-left\`). |
| \`offset\` | String | \`'25px'\` | Marge par rapport au bord de l'écran. |
| \`theme\` | String | \`'dark'\` | Thème de base de l'interface (\`'dark'\` ou \`'light'\`). |
| \`primaryColor\` | String | \`'#1DB954'\` | Couleur principale (Bouton d'ouverture, slider, visualizer). |
| \`glassmorphism\`| Boolean | \`false\` | Active un fond semi-transparent avec flou d'arrière-plan (backdrop-filter). |
| \`borderRadius\` | String | \`'16px'\` | Rayon des bordures du lecteur étendu. |
| \`fontFamily\` | String | \`'system-ui...'\`| Typographie utilisée dans tout le widget. |
| \`hideDownload\` | Boolean | \`false\` | Masque l'icône de téléchargement direct. |
| \`hideVisualizer\`| Boolean | \`false\` | Masque les 3 barres animées à côté du titre. |
| \`autoOpen\` | Boolean | \`false\` | Déploie le widget automatiquement lors de la première visite. |
| \`defaultGenre\` | String | \`'all'\` | L'ID du genre au démarrage (ex: \`'10'\` pour House). |
| \`startVolume\` | Number | \`0.5\` | Volume initial entre 0.0 et 1.0 (surchargé si l'utilisateur a déjà un cache). |
| \`apiUrl\` | String | *https://www.wordreference.com/definition/interne* | URL de l'API Backend. |

---

## 🎨 Personnalisation CSS Avancée

Le widget expose des **Variables CSS** (Custom Properties) rattachées à l'ID `#ncs-persistent-widget`. Vous pouvez les surcharger directement dans la feuille de style de votre site :

\`\`\`css
#ncs-persistent-widget {
    --ncs-bg: #000000;          /* Fond du widget */
    --ncs-border: #333333;      /* Couleur de la bordure */
    --ncs-panel-bg: #111111;    /* Fond des listes et des images */
}
\`\`\`

---

## 🏗️ Architecture & Backend

En raison des restrictions CORS strictes sur le web moderne, un navigateur web ne peut pas interroger directement le site de NCS. Ce widget s'appuie donc sur une API Backend Node.js qui sert de relais de données (Proxy). 

---

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

**Avertissement :** Ce projet n'est pas affilié à NoCopyrightSounds. Toutes les musiques diffusées par ce widget appartiennent à leurs créateurs respectifs et à NCS. Veuillez respecter les conditions d'utilisation de NoCopyrightSounds lors de l'utilisation de leurs œuvres.