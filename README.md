# 🎧 NoCopyrightSounds (NCS) Web Widget

[![NPM Version](https://img.shields.io/npm/v/nocopyrightsounds-widget.svg?style=flat-square&color=1DB954)](https://www.npmjs.com/package/nocopyrightsounds-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Un lecteur musical flottant, élégant et hautement personnalisable pour intégrer facilement les musiques libres de droits de **NoCopyrightSounds** à n'importe quel site web. 

Conçu pour les développeurs modernes : léger, persistant entre les changements de pages, et entièrement paramétrable via JavaScript et CSS.

![NCS Widget Preview](https://raw.githubusercontent.com/floriangobin/nocopyrightsounds-widget/main/preview.png) *(Ajoutez une capture d'écran de votre widget dans votre dépôt GitHub et remplacez ce lien !)*

---

## ✨ Fonctionnalités

* ⚡ **Zéro Latence :** Algorithme de préchargement (buffering) en arrière-plan pour des transitions instantanées.
* 💾 **Persistance d'état :** Mémorise la piste en cours, le volume, la progression et l'état du widget d'une page à l'autre via `localStorage`.
* 🎨 **Design Premium & Glassmorphism :** Support natif des modes clair/sombre, personnalisation des couleurs et effet de verre dépoli.
* 🎛️ **Contrôles Complets :** Boutons Suivant/Précédent avec historique, contrôle du volume, Mute, et barre de progression.
* 🎵 **Catalogue Complet :** Navigation aléatoire intelligente parmi les 60+ genres historiques de NCS.
* 🔘 **Bouton Réduit Sur Mesure :** Transformez l'icône flottante en cercle, en carré, changez l'émoji ou mettez-y du texte !
* 🔌 **Prêt à l'emploi (Plug & Play) :** API backend officielle intégrée par défaut. Zéro configuration requise !

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

### Exemple basique (Zéro configuration)
\`\`\`html
<script type="module">
    import NCSWidget from 'https://cdn.jsdelivr.net/npm/nocopyrightsounds-widget@latest/src/index.js';
    
    // Le widget s'occupe de tout avec les paramètres par défaut !
    const player = new NCSWidget();
</script>
\`\`\`

### Exemple Avancé (Design sur mesure)
\`\`\`javascript
const widget = new NCSWidget({
    position: 'bottom-left', 
    theme: 'dark',           
    primaryColor: '#ff0055', 
    glassmorphism: true,     
    borderRadius: '12px',    
    defaultGenre: '10',      // Démarre sur la House (ID: 10)
    
    // 🔥 Personnalisation du bouton réduit
    minimizedIcon: '🎵 Play',    // Texte au lieu d'un émoji
    minimizedSize: '80px',       // Bouton plus large
    minimizedRadius: '12px',     // Bords arrondis (au lieu d'un cercle parfait)
    minimizedBg: '#222222',      // Fond sombre
    minimizedColor: '#ff0055'    // Texte coloré
});
\`\`\`

---

## ⚙️ Configuration Détaillée (Options)

| Option | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| \`position\` | String | \`'bottom-right'\` | Position (\`bottom-right\`, \`bottom-left\`, \`top-right\`, \`top-left\`). |
| \`offset\` | String | \`'25px'\` | Marge par rapport au bord de l'écran. |
| \`theme\` | String | \`'dark'\` | Thème de base de l'interface (\`'dark'\` ou \`'light'\`). |
| \`primaryColor\` | String | \`'#1DB954'\` | Couleur principale (Sliders, visualizer). |
| \`glassmorphism\`| Boolean | \`false\` | Active un fond semi-transparent avec flou d'arrière-plan. |
| \`borderRadius\` | String | \`'16px'\` | Rayon des bordures du lecteur étendu. |
| \`fontFamily\` | String | \`'system-ui...'\`| Typographie utilisée dans tout le widget. |
| \`minimizedIcon\`| String | \`'🎧'\` | Icône ou texte du bouton réduit. |
| \`minimizedSize\`| String | \`'55px'\` | Largeur/Hauteur du bouton réduit. |
| \`minimizedRadius\`| String| \`'50%'\` | Arrondi du bouton réduit (\`50%\` = rond, \`8px\` = carré arrondi). |
| \`minimizedBg\`  | String | *primaryColor*| Couleur de fond spécifique au bouton réduit. |
| \`minimizedColor\`| String| \`'#ffffff'\` | Couleur de l'icône/texte du bouton réduit. |
| \`hideDownload\` | Boolean | \`false\` | Masque l'icône de téléchargement direct. |
| \`hideVisualizer\`| Boolean | \`false\` | Masque les barres animées à côté du titre. |
| \`autoOpen\` | Boolean | \`false\` | Déploie le widget automatiquement à la 1ère visite. |
| \`defaultGenre\` | String | \`'all'\` | L'ID du genre au démarrage (ex: \`'10'\` pour House). |
| \`startVolume\` | Number | \`0.5\` | Volume initial entre 0.0 et 1.0. |

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

En raison des restrictions CORS strictes sur le web moderne, un navigateur web ne peut pas interroger directement le site de NCS. Ce widget s'appuie donc sur une API Backend Node.js.
**Une instance publique hébergée sur Render est configurée par défaut dans le widget pour un usage "Plug & Play".**

---

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

**Avertissement :** Ce projet n'est pas affilié à NoCopyrightSounds. Toutes les musiques diffusées appartiennent à leurs créateurs respectifs et à NCS.