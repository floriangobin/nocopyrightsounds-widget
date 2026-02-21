class NCSWidget {
    constructor(userOptions = {}) {
        // 🛠️ 1. Configurations par défaut (Fusionnées avec les choix de l'utilisateur)
        const defaultOptions = {
            position: 'bottom-right',
            apiUrl: 'https://VOTRE-URL-RENDER.onrender.com', // ⚠️ METTEZ VOTRE URL RENDER ICI
            theme: 'dark', // 'dark' ou 'light'
            primaryColor: '#1DB954', // Vert NCS par défaut
            defaultGenre: 'all',
            startVolume: 0.5,
            offset: '25px', // Distance par rapport au bord de l'écran
            zIndex: 99999
        };

        this.options = { ...defaultOptions, ...userOptions };
        
        this.audio = new Audio();
        this.isPlaying = false;
        
        this.trackHistory = [];
        this.currentHistoryIndex = -1;
        this.nextTracksQueue = [];
        this.isPreloading = false;
        
        this.isBrowser = typeof window !== 'undefined';
        if (this.isBrowser) {
            const savedVol = localStorage.getItem('ncs_volume');
            this.audio.volume = savedVol !== null ? parseFloat(savedVol) : this.options.startVolume;
            this.lastVolume = this.audio.volume > 0 ? this.audio.volume : this.options.startVolume;
            
            this.savedTime = localStorage.getItem('ncs_currentTime') || 0;
            this.savedTrack = localStorage.getItem('ncs_currentTrack') || null;
            this.savedCover = localStorage.getItem('ncs_currentCover') || null;
            this.savedTitle = localStorage.getItem('ncs_currentTitle') || null;
            this.savedArtists = localStorage.getItem('ncs_currentArtists') || null;
            this.isWidgetOpen = localStorage.getItem('ncs_isOpen') === 'true';
        }

        this.initDOM();
        this.attachEvents();
        
        if (this.savedTrack && this.savedTime > 0) {
            this.restoreTrack();
            this.fillQueue(this.genreSelect.value);
        } else {
            // Utiliser le genre par défaut défini dans les options
            this.genreSelect.value = this.options.defaultGenre;
            this.changeGenre(this.options.defaultGenre);
        }
    }

    initDOM() {
        if (!this.isBrowser) return;

        this.container = document.createElement('div');
        this.container.id = 'ncs-persistent-widget';
        
        // 🎨 2. Application du thème (Variables CSS dynamiques)
        const isLight = this.options.theme === 'light';
        const colors = {
            bg: isLight ? '#ffffff' : '#181818',
            text: isLight ? '#222222' : '#ffffff',
            textMuted: isLight ? '#666666' : '#b3b3b3',
            border: isLight ? '#e0e0e0' : '#282828',
            panelBg: isLight ? '#f5f5f5' : '#282828',
            sliderBg: isLight ? '#d3d3d3' : '#535353',
            btnBg: isLight ? '#222222' : '#ffffff',
            btnColor: isLight ? '#ffffff' : '#000000'
        };

        const style = document.createElement('style');
        style.textContent = `
            #ncs-persistent-widget {
                /* Variables CSS exposées pour les développeurs */
                --ncs-primary: ${this.options.primaryColor};
                --ncs-bg: ${colors.bg};
                --ncs-text: ${colors.text};
                --ncs-text-muted: ${colors.textMuted};
                --ncs-border: ${colors.border};
                --ncs-panel-bg: ${colors.panelBg};
                --ncs-slider-bg: ${colors.sliderBg};
                --ncs-btn-bg: ${colors.btnBg};
                --ncs-btn-color: ${colors.btnColor};
                
                position: fixed;
                ${this.getPositionStyles()}
                z-index: ${this.options.zIndex};
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .ncs-minimized { width: 55px; height: 55px; border-radius: 50%; background: var(--ncs-primary); cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 6px 15px rgba(0,0,0, 0.2); font-size: 24px; transition: transform 0.2s; color: white; }
            .ncs-minimized:hover { transform: scale(1.1); }
            .ncs-minimized.hidden { display: none; }
            
            .ncs-expanded { width: 320px; background: var(--ncs-bg); color: var(--ncs-text); border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: none; border: 1px solid var(--ncs-border); }
            .ncs-expanded.active { display: block; animation: ncsFadeIn 0.3s ease; }
            
            .ncs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .ncs-header strong { font-size: 14px; font-weight: 600; color: var(--ncs-text-muted); letter-spacing: 1px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
            .ncs-close-btn { background: transparent; border: none; color: var(--ncs-text-muted); font-size: 18px; cursor: pointer; padding: 0; transition: color 0.2s; }
            .ncs-close-btn:hover { color: var(--ncs-text); }
            
            .ncs-visualizer { display: flex; gap: 2px; height: 12px; align-items: flex-end; opacity: 0; transition: opacity 0.3s; }
            .ncs-visualizer.playing { opacity: 1; }
            .ncs-bar { width: 3px; background: var(--ncs-primary); border-radius: 2px; animation: bounce 0.5s infinite alternate; }
            .ncs-bar:nth-child(2) { animation-delay: 0.15s; }
            .ncs-bar:nth-child(3) { animation-delay: 0.3s; }
            @keyframes bounce { from { height: 3px; } to { height: 12px; } }
            
            .ncs-track-info { display: flex; align-items: center; margin-bottom: 15px; }
            .ncs-cover { width: 65px; height: 65px; border-radius: 8px; background: var(--ncs-panel-bg); margin-right: 15px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .ncs-details { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
            #ncs-track-name { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
            #ncs-artists { font-size: 11px; color: var(--ncs-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px; }
            #ncs-genre { width: 100%; padding: 4px 8px; background: var(--ncs-panel-bg); color: var(--ncs-text); border: 1px solid var(--ncs-border); border-radius: 6px; font-size: 12px; cursor: pointer; outline: none; }
            
            .ncs-progress-container { margin-bottom: 15px; display:flex; align-items:center; gap: 10px; font-size: 11px; color: var(--ncs-text-muted); font-variant-numeric: tabular-nums; }
            .ncs-slider { -webkit-appearance: none; width: 100%; height: 4px; background: var(--ncs-slider-bg); border-radius: 2px; outline: none; cursor: pointer; }
            .ncs-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--ncs-primary); cursor: pointer; transition: transform 0.1s; }
            .ncs-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
            
            .ncs-controls { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px; }
            .ncs-btn-circle { width: 50px; height: 50px; border-radius: 50%; background: var(--ncs-btn-bg); color: var(--ncs-btn-color); border: none; font-size: 20px; cursor: pointer; display:flex; justify-content:center; align-items:center; transition: transform 0.2s; padding-left: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .ncs-btn-circle.paused { padding-left: 0; }
            .ncs-btn-circle:hover { transform: scale(1.05); }
            .ncs-btn-icon { background: transparent; border: none; color: var(--ncs-text-muted); font-size: 20px; cursor: pointer; transition: color 0.2s; padding: 5px; }
            .ncs-btn-icon:hover { color: var(--ncs-text); }
            .ncs-btn-icon:disabled { color: var(--ncs-border); cursor: not-allowed; }
            
            .ncs-bottom-bar { display: flex; justify-content: space-between; align-items: center; }
            .ncs-volume-container { display: flex; align-items: center; gap: 8px; color: var(--ncs-text-muted); flex: 1; margin-right: 15px; }
            #ncs-mute-btn { cursor: pointer; transition: transform 0.1s; user-select: none; }
            #ncs-mute-btn:hover { transform: scale(1.1); }
            .ncs-download-btn { color: var(--ncs-text-muted); text-decoration: none; font-size: 18px; transition: color 0.2s; }
            .ncs-download-btn:hover { color: var(--ncs-primary); }
            
            @keyframes ncsFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;

        this.container.innerHTML = `
            <div class="ncs-minimized ${this.isWidgetOpen ? 'hidden' : ''}">🎧</div>
            <div class="ncs-expanded ${this.isWidgetOpen ? 'active' : ''}">
                <div class="ncs-header">
                    <strong>NCS Player
                        <div class="ncs-visualizer" id="ncs-vis">
                            <div class="ncs-bar"></div><div class="ncs-bar"></div><div class="ncs-bar"></div>
                        </div>
                    </strong>
                    <button class="ncs-close-btn">✖</button>
                </div>
                
                <div class="ncs-track-info">
                    <img id="ncs-cover" class="ncs-cover" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Cover" />
                    <div class="ncs-details">
                        <div id="ncs-track-name">Chargement...</div>
                        <div id="ncs-artists">Artiste(s)</div>
                        <select id="ncs-genre">
                            <option value="all">🌍 Tous les genres</option>
                            <option value="31">Alternative Dance</option>
                            <option value="10">House</option>
                            <option value="2">Chill</option>
                            <option value="5">Dubstep</option>
                            <option value="7">Electronic</option>
                            <option value="3">Drum & Bass</option>
                            <option value="9">Hardstyle</option>
                            <option value="14">Trap</option>
                            </select>
                    </div>
                </div>

                <div class="ncs-progress-container">
                    <span id="ncs-time-current">0:00</span>
                    <input type="range" id="ncs-progress" class="ncs-slider" min="0" max="100" value="0">
                    <span id="ncs-time-total">0:00</span>
                </div>

                <div class="ncs-controls">
                    <button id="ncs-prev" class="ncs-btn-icon" disabled>⏮</button>
                    <button id="ncs-play-pause" class="ncs-btn-circle">▶</button>
                    <button id="ncs-next" class="ncs-btn-icon">⏭</button>
                </div>

                <div class="ncs-bottom-bar">
                    <div class="ncs-volume-container">
                        <span id="ncs-mute-btn">${this.audio.volume === 0 ? '🔇' : '🔊'}</span>
                        <input type="range" id="ncs-volume" class="ncs-slider" min="0" max="1" step="0.05" value="${this.audio.volume}">
                    </div>
                    <a id="ncs-download" class="ncs-download-btn" href="#" target="_blank" title="Télécharger ce titre">⬇️</a>
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
        this.prevBtn = this.container.querySelector('#ncs-prev');
        this.downloadBtn = this.container.querySelector('#ncs-download');
        this.muteBtn = this.container.querySelector('#ncs-mute-btn');
        this.visualizer = this.container.querySelector('#ncs-vis');
        this.genreSelect = this.container.querySelector('#ncs-genre');
        this.trackName = this.container.querySelector('#ncs-track-name');
        this.artistsName = this.container.querySelector('#ncs-artists');
        this.coverImg = this.container.querySelector('#ncs-cover');
        this.progressBar = this.container.querySelector('#ncs-progress');
        this.volumeBar = this.container.querySelector('#ncs-volume');
        this.timeCurrent = this.container.querySelector('#ncs-time-current');
        this.timeTotal = this.container.querySelector('#ncs-time-total');
    }

    getPositionStyles() {
        const offset = this.options.offset;
        const positions = {
            'bottom-right': `bottom: ${offset}; right: ${offset};`,
            'bottom-left': `bottom: ${offset}; left: ${offset};`,
            'top-right': `top: ${offset}; right: ${offset};`,
            'top-left': `top: ${offset}; left: ${offset};`
        };
        return positions[this.options.position] || positions['bottom-right'];
    }

    attachEvents() {
        if (!this.isBrowser) return;
        
        this.minimized.addEventListener('click', () => this.toggleState(true));
        this.container.querySelector('.ncs-close-btn').addEventListener('click', () => this.toggleState(false));
        
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.nextBtn.addEventListener('click', () => this.handleNext());
        this.prevBtn.addEventListener('click', () => this.handlePrev());
        this.genreSelect.addEventListener('change', (e) => this.changeGenre(e.target.value));

        this.audio.addEventListener('play', () => {
            this.playBtn.innerHTML = '⏸';
            this.playBtn.classList.add('paused');
            this.visualizer.classList.add('playing');
        });
        this.audio.addEventListener('pause', () => {
            this.playBtn.innerHTML = '▶';
            this.playBtn.classList.remove('paused');
            this.visualizer.classList.remove('playing');
        });
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => {
            this.progressBar.max = this.audio.duration;
            this.timeTotal.innerText = this.formatTime(this.audio.duration);
        });
        this.audio.addEventListener('ended', () => this.handleNext());

        this.progressBar.addEventListener('input', (e) => { this.audio.currentTime = e.target.value; });
        
        this.volumeBar.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            this.audio.volume = vol;
            if (vol > 0) this.lastVolume = vol;
            this.updateMuteIcon(vol);
            localStorage.setItem('ncs_volume', vol);
        });

        this.muteBtn.addEventListener('click', () => {
            if (this.audio.volume > 0) {
                this.lastVolume = this.audio.volume;
                this.audio.volume = 0;
                this.volumeBar.value = 0;
            } else {
                this.audio.volume = this.lastVolume || 1.0;
                this.volumeBar.value = this.audio.volume;
            }
            this.updateMuteIcon(this.audio.volume);
            localStorage.setItem('ncs_volume', this.audio.volume);
        });

        setInterval(() => {
            if (this.isPlaying && this.audio.currentTime > 0) {
                localStorage.setItem('ncs_currentTime', this.audio.currentTime);
            }
        }, 1000);
    }

    updateMuteIcon(vol) {
        if (vol === 0) {
            this.muteBtn.innerText = '🔇';
        } else if (vol < 0.5) {
            this.muteBtn.innerText = '🔉';
        } else {
            this.muteBtn.innerText = '🔊';
        }
    }

    toggleState(isOpen) {
        if (isOpen) {
            this.minimized.classList.add('hidden');
            this.expanded.classList.add('active');
        } else {
            this.minimized.classList.remove('hidden');
            this.expanded.classList.remove('active');
        }
        localStorage.setItem('ncs_isOpen', isOpen);
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            if (this.savedTime > 0 && this.audio.currentTime === 0) {
                this.audio.currentTime = this.savedTime;
            }
            this.audio.play();
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

    async fetchSingleTrack(genre) {
        try {
            const response = await fetch(`${this.options.apiUrl}/search?genre=${genre}`);
            const data = await response.json();
            return (data && data.length > 0) ? data[0] : null;
        } catch (error) {
            console.error("Erreur API NCS:", error);
            return null;
        }
    }

    async fillQueue(genre) {
        if (this.isPreloading) return;
        this.isPreloading = true;

        while (this.nextTracksQueue.length < 2) {
            const track = await this.fetchSingleTrack(genre);
            if (track) {
                const isDuplicate = this.nextTracksQueue.find(t => t.audioUrl === track.audioUrl);
                if (!isDuplicate) this.nextTracksQueue.push(track);
            } else {
                break;
            }
        }
        this.isPreloading = false;
    }

    async changeGenre(genre) {
        this.nextTracksQueue = [];
        this.trackName.innerText = "Recherche...";
        this.artistsName.innerText = "...";
        
        const track = await this.fetchSingleTrack(genre);
        if (track) {
            this.setTrack(track, true);
            this.fillQueue(genre);
        } else {
            this.trackName.innerText = "Aucune piste.";
            this.artistsName.innerText = "";
        }
    }

    restoreTrack() {
        this.audio.src = this.savedTrack;
        this.trackName.innerText = this.savedTitle;
        this.artistsName.innerText = this.savedArtists || "NCS Release";
        if (this.savedCover) this.coverImg.src = this.savedCover;
        this.downloadBtn.href = this.savedTrack;
        
        this.trackHistory = [{
            audioUrl: this.savedTrack,
            title: this.savedTitle,
            artists: this.savedArtists,
            coverUrl: this.savedCover
        }];
        this.currentHistoryIndex = 0;
    }

    setTrack(track, addToHistory = false) {
        this.audio.src = track.audioUrl;
        this.trackName.innerText = track.title;
        
        const artistes = track.artists || "NCS Release";
        this.artistsName.innerText = artistes;
        this.artistsName.title = artistes;
        
        if (track.coverUrl) this.coverImg.src = track.coverUrl;
        this.downloadBtn.href = track.audioUrl;
        
        if (addToHistory) {
            this.trackHistory = this.trackHistory.slice(0, this.currentHistoryIndex + 1);
            this.trackHistory.push(track);
            this.currentHistoryIndex = this.trackHistory.length - 1;
            this.prevBtn.disabled = this.currentHistoryIndex <= 0;
        }

        if (this.isBrowser) {
            localStorage.setItem('ncs_currentTrack', track.audioUrl);
            localStorage.setItem('ncs_currentTitle', track.title);
            localStorage.setItem('ncs_currentArtists', artistes);
            localStorage.setItem('ncs_currentCover', track.coverUrl);
            localStorage.setItem('ncs_currentTime', 0);
            this.savedTime = 0;
        }
        
        if (this.isPlaying) {
            this.audio.play();
        } else if (this.audio.currentTime === 0 && this.playBtn.innerHTML === '⏸') {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    async handleNext() {
        const genre = this.genreSelect.value;
        if (this.currentHistoryIndex < this.trackHistory.length - 1) {
            this.currentHistoryIndex++;
            this.setTrack(this.trackHistory[this.currentHistoryIndex], false);
            this.prevBtn.disabled = this.currentHistoryIndex <= 0;
        } 
        else if (this.nextTracksQueue.length > 0) {
            const nextTrack = this.nextTracksQueue.shift();
            this.setTrack(nextTrack, true);
            this.fillQueue(genre);
        } 
        else {
            this.trackName.innerText = "Recherche...";
            this.artistsName.innerText = "...";
            const track = await this.fetchSingleTrack(genre);
            if (track) {
                this.setTrack(track, true);
                this.fillQueue(genre);
            }
        }
    }

    handlePrev() {
        if (this.currentHistoryIndex > 0) {
            this.currentHistoryIndex--;
            this.setTrack(this.trackHistory[this.currentHistoryIndex], false);
            this.prevBtn.disabled = this.currentHistoryIndex <= 0;
            this.savedTime = 0;
            localStorage.setItem('ncs_currentTime', 0);
        }
    }
}

export default NCSWidget;