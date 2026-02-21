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
* 🎨 **Thèmes & Couleurs :** Support natif des modes clair (`light`) et sombre (`dark`), avec personnalisation de la couleur principale.
* 🎛️ **Contrôles Complets :** Boutons Suivant/Précédent avec historique, contrôle du volume, Mute, et barre de progression cliquable.
* 🎵 **+60 Genres :** Navigation aléatoire intelligente parmi tout le catalogue historique de NCS (House, Dubstep, Chill, etc.).
* ⬇️ **Téléchargement :** Bouton intégré pour récupérer directement le fichier MP3 officiel.

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

### Exemple en Vanilla JS (HTML)
\`\`\`html
<body>
    <script type="module">
        import NCSWidget from 'https://cdn.jsdelivr.net/npm/nocopyrightsounds-widget@latest/src/index.js';

        // Initialisation basique
        const player = new NCSWidget();
    </script>
</body>
\`\`\`

### Exemple dans React (Next.js, Vite...)
\`\`\`jsx
import { useEffect } from 'react';
import NCSWidget from 'nocopyrightsounds-widget';

export default function App() {
  useEffect(() => {
    const widget = new NCSWidget({
      position: 'bottom-right',
      theme: 'dark',
      primaryColor: '#1DB954'
    });

    // Nettoyage lors du démontage du composant
    return () => {
      const el = document.getElementById('ncs-persistent-widget');
      if (el) el.remove();
    };
  }, []);

  return (
    <div>
      <h1>Mon Super Site</h1>
    </div>
  );
}
\`\`\`

---

## ⚙️ Configuration (Options de l'objet)

Vous pouvez passer un objet d'options au constructeur pour personnaliser le comportement du widget :

| Option | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| \`position\` | String | \`'bottom-right'\` | Position à l'écran (\`bottom-right\`, \`bottom-left\`, \`top-right\`, \`top-left\`). |
| \`offset\` | String | \`'25px'\` | Marge par rapport au bord de l'écran. |
| \`theme\` | String | \`'dark'\` | Thème de base de l'interface (\`'dark'\` ou \`'light'\`). |
| \`primaryColor\` | String | \`'#1DB954'\` | Couleur principale (Bouton d'ouverture, slider, visualizer). |
| \`defaultGenre\` | String | \`'all'\` | L'ID du genre au démarrage (ex: \`'10'\` pour House). |
| \`startVolume\` | Number | \`0.5\` | Volume initial entre 0.0 et 1.0 (surchargé si l'utilisateur a déjà un cache). |
| \`zIndex\` | Number | \`99999\` | Profondeur d'affichage CSS (z-index). |
| \`apiUrl\` | String | *https://www.wordreference.com/definition/interne* | URL de l'API Backend. Vous pouvez héberger la vôtre si besoin. |

---

## 🎨 Personnalisation CSS Avancée

Si les options du constructeur ne suffisent pas, le widget expose des **Variables CSS** (Custom Properties) rattachées à l'ID `#ncs-persistent-widget`. Vous pouvez les surcharger directement dans la feuille de style de votre site :

\`\`\`css
/* Dans le fichier style.css de votre site web */
#ncs-persistent-widget {
    --ncs-bg: #000000;          /* Fond du widget (Noir pur) */
    --ncs-border: #333333;      /* Couleur de la bordure */
    --ncs-primary: #ff0055;     /* Remplace le vert par du rose fluo */
    --ncs-panel-bg: #111111;    /* Fond des éléments internes (images, selects) */
    font-family: 'Roboto', sans-serif; /* Changement de police */
    border-radius: 0px;         /* Retirer les coins arrondis */
}
\`\`\`

---

## 🏗️ Architecture & Backend

En raison des restrictions CORS strictes sur le web moderne, un navigateur web ne peut pas interroger directement le site de NCS. 
Ce widget s'appuie donc sur une API Backend Node.js qui sert de relais de données (Proxy). 

*Note : Une API publique par défaut est fournie avec ce widget pour un usage immédiat. Pour des environnements de production à fort trafic, il est recommandé de déployer votre propre instance du serveur relais.*

---

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

**Avertissement :** Ce projet n'est pas affilié à NoCopyrightSounds. Toutes les musiques diffusées par ce widget appartiennent à leurs créateurs respectifs et à NCS. Veuillez respecter les conditions d'utilisation de NoCopyrightSounds lors de l'utilisation de leurs œuvres.