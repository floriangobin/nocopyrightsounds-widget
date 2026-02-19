class NCSWidget {
    constructor(options = {}) {
        this.position = options.position || 'bottom-right';
        
        // 🌟 L'URL de VOTRE serveur par défaut (les autres devs n'auront rien à faire)
        this.apiUrl = options.apiUrl || 'https://ncs-backend-api.onrender.com';
        
        this.audio = new Audio();
        this.isPlaying = false;
        
        // Persistance des données (Volume, Temps, et Musique en cours)
        this.isBrowser = typeof window !== 'undefined';
        if (this.isBrowser) {
            this.audio.volume = localStorage.getItem('ncs_volume') || 0.5;
            this.savedTime = localStorage.getItem('ncs_currentTime') || 0;
            this.savedTrack = localStorage.getItem('ncs_currentTrack') || null;
            this.savedCover = localStorage.getItem('ncs_currentCover') || null;
            this.savedTitle = localStorage.getItem('ncs_currentTitle') || null;
        }

        this.initDOM();
        this.attachEvents();
        
        // Reprendre la lecture ou charger une nouvelle piste
        if (this.savedTrack && this.savedTime > 0) {
            this.restoreTrack();
        } else {
            this.loadTrack('electronic');
        }
    }

    initDOM() {
        if (!this.isBrowser) return;

        this.container = document.createElement('div');
        this.container.id = 'ncs-persistent-widget';
        
        const style = document.createElement('style');
        style.textContent = `
            #ncs-persistent-widget { position: fixed; ${this.getPositionStyles()} z-index: 99999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .ncs-minimized { width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(135deg, #1DB954, #1ed760); cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 6px 15px rgba(29, 185, 84, 0.4); font-size: 24px; transition: transform 0.2s; }
            .ncs-minimized:hover { transform: scale(1.1); }
            .ncs-expanded { width: 300px; background: #181818; color: white; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none; border: 1px solid #282828; }
            .ncs-expanded.active { display: block; animation: ncsFadeIn 0.3s ease; }
            .ncs-minimized.hidden { display: none; }
            
            .ncs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .ncs-header strong { font-size: 14px; font-weight: 600; color: #b3b3b3; letter-spacing: 1px; text-transform: uppercase; }
            .ncs-close-btn { background: transparent; border: none; color: #b3b3b3; font-size: 18px; cursor: pointer; padding: 0; transition: color 0.2s; }
            .ncs-close-btn:hover { color: white; }
            
            .ncs-track-info { display: flex; align-items: center; margin-bottom: 15px; }
            .ncs-cover { width: 60px; height: 60px; border-radius: 8px; background: #282828; margin-right: 15px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
            .ncs-details { flex: 1; overflow: hidden; }
            #ncs-track-name { font-size: 15px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; }
            #ncs-genre { width: 100%; padding: 4px 8px; background: #282828; color: #b3b3b3; border: 1px solid #333; border-radius: 4px; font-size: 12px; cursor: pointer; outline: none; }
            
            .ncs-progress-container { margin-bottom: 15px; display:flex; align-items:center; gap: 10px; font-size: 11px; color: #b3b3b3; }
            .ncs-slider { -webkit-appearance: none; width: 100%; height: 4px; background: #535353; border-radius: 2px; outline: none; cursor: pointer; }
            .ncs-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #1DB954; cursor: pointer; transition: transform 0.1s; }
            .ncs-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
            
            .ncs-controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 15px; }
            .ncs-btn-circle { width: 45px; height: 45px; border-radius: 50%; background: white; color: black; border: none; font-size: 18px; cursor: pointer; display:flex; justify-content:center; align-items:center; transition: transform 0.2s; }
            .ncs-btn-circle:hover { transform: scale(1.05); }
            .ncs-btn-icon { background: transparent; border: none; color: #b3b3b3; font-size: 20px; cursor: pointer; transition: color 0.2s; }
            .ncs-btn-icon:hover { color: white; }
            
            .ncs-volume-container { display: flex; align-items: center; gap: 10px; color: #b3b3b3; }
            
            @keyframes ncsFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;

        this.container.innerHTML = `
            <div class="ncs-minimized">🎧</div>
            <div class="ncs-expanded">
                <div class="ncs-header">
                    <strong>NCS Player</strong>
                    <button class="ncs-close-btn">✖</button>
                </div>
                
                <div class="ncs-track-info">
                    <img id="ncs-cover" class="ncs-cover" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Cover" />
                    <div class="ncs-details">
                        <div id="ncs-track-name">Chargement...</div>
                        <select id="ncs-genre">
                            <option value="electronic">⚡ Électronique</option>
                            <option value="house">🏠 House</option>
                            <option value="chill">☕ Chill</option>
                            <option value="synthwave">🌆 Synthwave</option>
                        </select>
                    </div>
                </div>

                <div class="ncs-progress-container">
                    <span id="ncs-time-current">0:00</span>
                    <input type="range" id="ncs-progress" class="ncs-slider" min="0" max="100" value="0">
                    <span id="ncs-time-total">0:00</span>
                </div>

                <div class="ncs-controls">
                    <button id="ncs-play-pause" class="ncs-btn-circle">▶</button>
                    <button id="ncs-next" class="ncs-btn-icon">⏭</button>
                </div>

                <div class="ncs-volume-container">
                    <span>🔉</span>
                    <input type="range" id="ncs-volume" class="ncs-slider" min="0" max="1" step="0.05" value="${this.audio.volume}">
                </div>
            </div>
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.container);

        // Références
        this.minimized = this.container.querySelector('.ncs-minimized');
        this.expanded = this.container.querySelector('.ncs-expanded');
        this.playBtn = this.container.querySelector('#ncs-play-pause');
        this.nextBtn = this.container.querySelector('#ncs-next');
        this.genreSelect = this.container.querySelector('#ncs-genre');
        this.trackName = this.container.querySelector('#ncs-track-name');
        this.coverImg = this.container.querySelector('#ncs-cover');
        this.progressBar = this.container.querySelector('#ncs-progress');
        this.volumeBar = this.container.querySelector('#ncs-volume');
        this.timeCurrent = this.container.querySelector('#ncs-time-current');
        this.timeTotal = this.container.querySelector('#ncs-time-total');
    }

    getPositionStyles() {
        const positions = {
            'bottom-right': 'bottom: 25px; right: 25px;',
            'bottom-left': 'bottom: 25px; left: 25px;',
            'top-right': 'top: 25px; right: 25px;',
            'top-left': 'top: 25px; left: 25px;'
        };
        return positions[this.position] || positions['bottom-right'];
    }

    attachEvents() {
        if (!this.isBrowser) return;
        
        // UI Events
        this.minimized.addEventListener('click', () => this.toggleState());
        this.container.querySelector('.ncs-close-btn').addEventListener('click', () => this.toggleState());
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.nextBtn.addEventListener('click', () => this.loadTrack(this.genreSelect.value));
        this.genreSelect.addEventListener('change', (e) => this.loadTrack(e.target.value));

        // Audio Events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => {
            this.progressBar.max = this.audio.duration;
            this.timeTotal.innerText = this.formatTime(this.audio.duration);
        });
        this.audio.addEventListener('ended', () => this.loadTrack(this.genreSelect.value)); // Auto-play suivant

        // Inputs interactifs
        this.progressBar.addEventListener('input', (e) => {
            this.audio.currentTime = e.target.value;
        });
        
        this.volumeBar.addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
            localStorage.setItem('ncs_volume', e.target.value);
        });

        // Sauvegarde de la progression chaque seconde
        setInterval(() => {
            if (this.isPlaying && this.audio.currentTime > 0) {
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
            this.playBtn.innerHTML = '▶';
        } else {
            // Reprendre là où on en était si c'est le 1er clic après un changement de page
            if (this.savedTime > 0 && this.audio.currentTime === 0) {
                this.audio.currentTime = this.savedTime;
            }
            this.audio.play();
            this.playBtn.innerHTML = '⏸';
        }
        this.isPlaying = !this.isPlaying;
    }

    updateProgress() {
        this.progressBar.value = this.audio.currentTime;
        this.timeCurrent.innerText = this.formatTime(this.audio.currentTime);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    restoreTrack() {
        this.audio.src = this.savedTrack;
        this.trackName.innerText = this.savedTitle;
        if (this.savedCover) this.coverImg.src = this.savedCover;
        // On ne met pas play() automatiquement à cause des règles des navigateurs (Autoplay policy)
    }

    async loadTrack(genre) {
        this.trackName.innerText = "Recherche...";
        try {
            const response = await fetch(`${this.apiUrl}/search?genre=${genre}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const track = data[0];
                this.audio.src = track.audioUrl;
                this.trackName.innerText = track.title;
                if (track.coverUrl) this.coverImg.src = track.coverUrl;
                
                // Sauvegarder la nouvelle piste courante
                if (this.isBrowser) {
                    localStorage.setItem('ncs_currentTrack', track.audioUrl);
                    localStorage.setItem('ncs_currentTitle', track.title);
                    localStorage.setItem('ncs_currentCover', track.coverUrl);
                    localStorage.setItem('ncs_currentTime', 0); // Reset timer
                    this.savedTime = 0;
                }
                
                // Si on était déjà en train d'écouter, on enchaîne
                if (this.isPlaying) {
                    this.audio.play();
                } else if (this.audio.currentTime === 0 && this.playBtn.innerHTML === '⏸') {
                    // Cas du clic sur "Suivant" alors que c'était en pause
                    this.audio.play();
                    this.isPlaying = true;
                }
            } else {
                this.trackName.innerText = "Aucune piste.";
            }
        } catch (error) {
            this.trackName.innerText = "Erreur API";
        }
    }
}

export default NCSWidget;