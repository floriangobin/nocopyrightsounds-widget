// src/index.js

class NCSWidget {
    constructor(options = {}) {
        this.position = options.position || 'bottom-right';
        this.apiUrl = options.apiUrl || 'https://ncs-api.kaninchenspeed.workers.dev';
        this.audio = new Audio();
        this.isPlaying = false;
        
        // Côté serveur (SSR comme Next.js), localStorage n'existe pas. On le sécurise.
        this.savedTime = typeof window !== 'undefined' && localStorage.getItem('ncs_currentTime') 
            ? localStorage.getItem('ncs_currentTime') 
            : 0;
        
        this.initDOM();
        this.attachEvents();
        this.loadTrack('electronic');
    }

    initDOM() {
        if (typeof document === 'undefined') return; // Sécurité pour le Server-Side Rendering

        this.container = document.createElement('div');
        this.container.id = 'ncs-persistent-widget';
        
        const style = document.createElement('style');
        style.textContent = `
            #ncs-persistent-widget { position: fixed; ${this.getPositionStyles()} z-index: 9999; font-family: sans-serif; transition: all 0.3s ease; }
            .ncs-minimized { width: 50px; height: 50px; border-radius: 50%; background: #1DB954; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
            .ncs-expanded { width: 250px; background: #222; color: white; border-radius: 12px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: none; }
            .ncs-expanded.active { display: block; }
            .ncs-minimized.hidden { display: none; }
            .ncs-controls { display: flex; justify-content: space-between; margin-top: 10px; }
            button { background: #1DB954; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
            select { width: 100%; padding: 5px; margin-bottom: 10px; background: #333; color: white; border: 1px solid #444; }
        `;

        this.container.innerHTML = `
            <div class="ncs-minimized">🎵</div>
            <div class="ncs-expanded">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <strong>NCS Player</strong>
                    <button class="ncs-close-btn" style="background:transparent; padding:0;">✖</button>
                </div>
                <select id="ncs-genre">
                    <option value="electronic">Électronique</option>
                    <option value="chill">Chill / Lo-Fi</option>
                    <option value="synthwave">Synthwave</option>
                </select>
                <div id="ncs-track-name" style="font-size:12px; margin-bottom:10px;">Chargement...</div>
                <div class="ncs-controls">
                    <button id="ncs-play-pause">Play</button>
                    <button id="ncs-next">Suivant</button>
                </div>
            </div>
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.container);

        this.minimized = this.container.querySelector('.ncs-minimized');
        this.expanded = this.container.querySelector('.ncs-expanded');
        this.playBtn = this.container.querySelector('#ncs-play-pause');
        this.genreSelect = this.container.querySelector('#ncs-genre');
        this.trackName = this.container.querySelector('#ncs-track-name');
    }

    getPositionStyles() {
        const positions = {
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;'
        };
        return positions[this.position] || positions['bottom-right'];
    }

    attachEvents() {
        if (typeof document === 'undefined') return;
        
        this.minimized.addEventListener('click', () => this.toggleState());
        this.container.querySelector('.ncs-close-btn').addEventListener('click', () => this.toggleState());
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.genreSelect.addEventListener('change', (e) => this.loadTrack(e.target.value));

        setInterval(() => {
            if (this.isPlaying && typeof window !== 'undefined') {
                localStorage.setItem('ncs_currentTime', this.audio.currentTime);
            }
        }, 1000);
    }

    toggleState() {
        this.minimized.classList.toggle('hidden');
        this.expanded.classList.toggle('active');
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.innerText = 'Play';
        } else {
            this.audio.play();
            this.playBtn.innerText = 'Pause';
        }
        this.isPlaying = !this.isPlaying;
    }

    async loadTrack(genre) {
        this.trackName.innerText = "Recherche...";
        try {
            const response = await fetch(`${this.apiUrl}/search?genre=${genre}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const track = data[0];
                this.audio.src = track.audioUrl; 
                this.trackName.innerText = track.title;
                
                if (this.savedTime > 0) {
                    this.audio.currentTime = this.savedTime;
                    this.savedTime = 0; 
                }
                
                if (this.isPlaying) this.audio.play();
            } else {
                this.trackName.innerText = "Aucune piste.";
            }
        } catch (error) {
            this.trackName.innerText = "Erreur API";
        }
    }
}

// Export par défaut pour l'utilisation en module
export default NCSWidget;