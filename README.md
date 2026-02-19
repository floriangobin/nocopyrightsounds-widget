# NoCopyrightSounds Widget 🎵

Un module persistant et personnalisable pour intégrer de la musique NCS sur n'importe quel site web.

## Installation

\`\`\`bash
npm install nocopyrightsounds-widget
\`\`\`

## Utilisation

\`\`\`javascript
import NCSWidget from 'nocopyrightsounds-widget';

const widget = new NCSWidget({
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    apiUrl: 'https://ncs-api.kaninchenspeed.workers.dev' // L'URL de votre API
});
\`\`\`