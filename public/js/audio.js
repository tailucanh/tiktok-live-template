/**
 * TempleAudioEngine — Zen Soundscapes & Spiritual Percussion Synthesizer
 * - Nhạc nền: Phát trực tiếp file âm thanh nếu có, hoặc tự động kích hoạt bộ hòa âm Chuông Xoay Tây Tạng
 *   (Tibetan Singing Bowl Harmonic Drone: 108Hz, 216Hz, 432Hz) tĩnh lặng, thư thái.
 * - Auto-Ducking: Tự động hạ 65% âm lượng nhạc nền khi có giọng đọc lời khấn, giúp tiếng đọc rõ ràng.
 * - Pháp khí:
 *   + Tiếng Mõ gỗ tụng kinh hữu cơ: 2 bộ dao động (Thân mõ + Tiếng gõ cốc đanh giòn) có biến thiên cao độ vi lượng.
 *   + Tiếng Đại Hồng Chung ngân vang 6 hòa âm Bát Nhã (sub-bass 108Hz -> 870Hz).
 *   + Chuông ngọc 528Hz (Solfeggio Love & Healing Frequency).
 */
class TempleAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.unlocked = false;

    const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=1');
    const isObs = typeof window !== 'undefined' && window.location.search.includes('obs=1');
    this.isPreview = isPreview;
    this.isObs = isObs;

    // Trong khung xem trước (Admin Preview iframe), TẮT TIẾNG 100% để không lọt âm thanh ra loa máy tính
    this.sfxEnabled = !isPreview;
    this.bgMusicEnabled = !isPreview;
    this.ttsEnabled = !isPreview;
    this.ttsVoice = 'maichi';

    const savedMusicVol = parseFloat(localStorage.getItem('temple_music_vol'));
    const savedTtsVol = parseFloat(localStorage.getItem('temple_tts_vol'));
    this.bgBaseVolume = isPreview ? 0 : (Number.isFinite(savedMusicVol) ? Math.max(0, Math.min(1, savedMusicVol)) : 0.65);
    this.ttsVolume = isPreview ? 0 : (Number.isFinite(savedTtsVol) ? Math.max(0, Math.min(1, savedTtsVol)) : 0.95);

    this.useSynthMusicFallback = false;
    this.synthBgTimer = null;
    this.ambientNodes = [];

    this.bgAudio = new Audio('/assets/bg_chant.m4a');
    this.bgAudio.loop = true;
    this.bgAudio.preload = 'auto';
    this.bgAudio.volume = this.bgBaseVolume;
    this.bgAudio.onerror = () => {
      this.useSynthMusicFallback = true;
    };

    this.ttsQueue = [];
    this.ttsPlaying = false;
    this.currentAudio = null;
    this.onTtsStateChange = null;

    // Trình phát nhạc nền YouTube ẩn (Headless YouTube Player)
    this.ytPlayer = null;
    this.ytReady = false;
    this.ytCurrentVideoId = '1zyhQjJ4i4U';
    this.ytBaseVolume = isPreview ? 0 : 65;
    this.ytPlaying = false;
    this.ytLoop = true;

    window.onYouTubeIframeAPIReady = () => {
      this.initYouTubePlayer();
    };
    if (window.YT && window.YT.Player) {
      this.initYouTubePlayer();
    }
  }

  initYouTubePlayer() {
    if (this.ytPlayer || !window.YT || !window.YT.Player) return;
    const container = document.getElementById('ytPlayerContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.id = 'ytPlayerFrame';
    container.appendChild(el);

    try {
      this.ytPlayer = new window.YT.Player('ytPlayerFrame', {
        height: '1',
        width: '1',
        videoId: this.ytCurrentVideoId || '1zyhQjJ4i4U',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            this.ytReady = true;
            if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
              if (this.isPreview) {
                this.ytPlayer.setVolume(0);
                if (typeof this.ytPlayer.mute === 'function') this.ytPlayer.mute();
              } else {
                this.ytPlayer.setVolume(this.ttsPlaying ? this.getYtDuckedVolume() : this.ytBaseVolume);
                if (this.ytPlaying) {
                  this.ytPlayer.playVideo();
                  this.stopZenAmbience();
                }
              }
            }
          },
          onStateChange: (event) => {
            if (window.YT && event.data === window.YT.PlayerState.ENDED && this.ytLoop) {
              if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
                this.ytPlayer.playVideo();
              }
            }
          }
        }
      });
    } catch (_) {}
  }

  getYtDuckedVolume() {
    return Math.max(10, Math.round(this.ytBaseVolume * 0.35));
  }

  handleYouTubeControl(ctrl) {
    if (!ctrl) return;
    if (this.isPreview) {
      if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
        this.ytPlayer.setVolume(0);
        if (typeof this.ytPlayer.mute === 'function') this.ytPlayer.mute();
      }
      return;
    }
    this.ensureContext();
    this.ytBaseVolume = Number.isFinite(Number(ctrl.volume)) ? Number(ctrl.volume) : 65;
    this.ytLoop = ctrl.loop !== false;

    if (ctrl.videoId && ctrl.videoId !== this.ytCurrentVideoId) {
      this.ytCurrentVideoId = ctrl.videoId;
      if (this.ytPlayer && this.ytReady && typeof this.ytPlayer.loadVideoById === 'function') {
        this.ytPlayer.loadVideoById(ctrl.videoId);
      }
    }

    if (ctrl.playing && ctrl.enabled) {
      this.ytPlaying = true;
      this.stopZenAmbience();
      if (this.ytPlayer && this.ytReady && typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.setVolume(this.ttsPlaying ? this.getYtDuckedVolume() : this.ytBaseVolume);
        this.ytPlayer.playVideo();
      }
    } else {
      this.ytPlaying = false;
      if (this.ytPlayer && this.ytReady && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
      }
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isPreview ? 0.0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
    if (this.bgMusicEnabled && !this.isPreview) {
      this.startZenAmbience();
    }
    return this.ctx;
  }

  setMasterMute(muted) {
    const isMuted = Boolean(muted);
    this.sfxEnabled = !isMuted;
    this.bgMusicEnabled = !isMuted;
    this.ttsEnabled = !isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(isMuted ? 0.0 : 1.0, this.ctx.currentTime);
    }
    if (isMuted) {
      this.setMusicVolume(0);
      this.setTtsVolume(0);
      if (this.ytPlayer && typeof this.ytPlayer.mute === 'function') {
        try { this.ytPlayer.mute(); this.ytPlayer.pauseVideo(); } catch (_) {}
      }
      this.stopZenAmbience();
    } else {
      this.ensureContext();
      this.setMusicVolume(0.65);
      this.setTtsVolume(0.95);
      if (this.ytPlayer && typeof this.ytPlayer.unMute === 'function') {
        try {
          this.ytPlayer.unMute();
          this.ytPlayer.setVolume(this.ytBaseVolume || 65);
          if (this.ytPlaying) this.ytPlayer.playVideo();
        } catch (_) {}
      }
      this.startZenAmbience();
    }
  }

  getDuckedVolume() {
    return Math.max(0.08, +(this.bgBaseVolume * 0.32).toFixed(2));
  }

  setMusicVolume(vol) {
    const v = Math.max(0, Math.min(1, Number(vol)));
    if (!Number.isFinite(v)) return;
    this.bgBaseVolume = v;
    try {
      localStorage.setItem('temple_music_vol', String(v));
    } catch (_) {}
    if (this.bgAudio && !this.useSynthMusicFallback) {
      this.bgAudio.volume = this.ttsPlaying ? this.getDuckedVolume() : this.bgBaseVolume;
    }
    if (this.ambientMasterGain && this.ctx) {
      const targetVol = (this.ttsPlaying ? this.getDuckedVolume() : this.bgBaseVolume) * 0.22;
      this.ambientMasterGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.3);
    }
  }

  setTtsVolume(vol) {
    const v = Math.max(0, Math.min(1, Number(vol)));
    if (!Number.isFinite(v)) return;
    this.ttsVolume = v;
    try {
      localStorage.setItem('temple_tts_vol', String(v));
    } catch (_) {}
    if (this.currentAudio) {
      this.currentAudio.volume = this.ttsVolume;
    }
  }

  startZenAmbience() {
    if (!this.bgMusicEnabled) return;
    if (this.useSynthMusicFallback) {
      this.startDefaultZenSynthLoop();
      return;
    }
    try {
      this.bgAudio.volume = this.ttsPlaying ? this.getDuckedVolume() : this.bgBaseVolume;
      if (this.bgAudio.paused) {
        const p = this.bgAudio.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            this.useSynthMusicFallback = true;
            this.startDefaultZenSynthLoop();
          });
        }
      }
    } catch (_) {
      this.useSynthMusicFallback = true;
      this.startDefaultZenSynthLoop();
    }
  }

  startDefaultZenSynthLoop() {
    if (!this.bgMusicEnabled || this.synthBgTimer) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Bộ hòa âm Chuông Xoay Tây Tạng & Thiền Định 432Hz tĩnh tâm
    const CHORD_FREQS = [108, 216, 324, 432, 540];
    let chordIdx = 0;

    const playZenBowlChord = () => {
      if (!this.bgMusicEnabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const root = CHORD_FREQS[chordIdx % CHORD_FREQS.length];
        chordIdx++;
        const targetVol = (this.ttsPlaying ? this.getDuckedVolume() : this.bgBaseVolume) * 0.16;
        if (targetVol <= 0.002) return;

        [root, root * 1.5, root * 2.0].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.6, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(targetVol / (idx + 1.2), now + 1.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);

          osc.connect(gain);
          gain.connect(this.masterGain || this.ctx.destination);
          osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
          };
          osc.start(now);
          osc.stop(now + 6.0);
        });
      } catch (_) {}
    };

    playZenBowlChord();
    this.synthBgTimer = setInterval(playZenBowlChord, 4800);
  }

  stopZenAmbience() {
    try {
      this.bgAudio.pause();
    } catch (_) {}
    if (this.synthBgTimer) {
      clearInterval(this.synthBgTimer);
      this.synthBgTimer = null;
    }
  }

  setBgDucking(ducked) {
    if (this.ytPlayer && this.ytReady && this.ytPlaying && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(ducked ? this.getYtDuckedVolume() : this.ytBaseVolume);
      } catch (_) {}
    }
    if (!this.bgMusicEnabled) return;
    try {
      if (!this.useSynthMusicFallback && this.bgAudio) {
        this.bgAudio.volume = ducked ? this.getDuckedVolume() : this.bgBaseVolume;
      }
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 2. TIẾNG MÕ GỖ TỤNG KINH (NATURAL WOODBLOCK PERCUSSION SYNTH)
  // --------------------------------------------------------------------------
  playWoodenFish(pitchMultiplier = 1.0) {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;

      // Biến thiên cao độ vi lượng chống máy móc khi người xem thả tim dồn dập
      const microVar = 0.97 + Math.random() * 0.06;
      const baseFreq = 640 * pitchMultiplier * microVar;

      // 1. Dao động thân mõ chính (Triangle Wave)
      const osc1 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain1 = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq * 1.45, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.016);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.84, now + 0.13);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.18, now);
      filter.Q.setValueAtTime(4.2, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.32, now + 0.005);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(this.masterGain || ctx.destination);

      // 2. Tiếng gõ dùi chạm gỗ đanh giòn (Wood Snap Attack)
      const oscSnap = ctx.createOscillator();
      const gainSnap = ctx.createGain();
      oscSnap.type = 'sine';
      oscSnap.frequency.setValueAtTime(baseFreq * 2.8, now);
      oscSnap.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.02);

      gainSnap.gain.setValueAtTime(0.18, now);
      gainSnap.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      oscSnap.connect(gainSnap);
      gainSnap.connect(this.masterGain || ctx.destination);

      osc1.onended = () => {
        osc1.disconnect();
        filter.disconnect();
        gain1.disconnect();
      };
      oscSnap.onended = () => {
        oscSnap.disconnect();
        gainSnap.disconnect();
      };

      osc1.start(now);
      osc1.stop(now + 0.17);
      oscSnap.start(now);
      oscSnap.stop(now + 0.03);
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 3. TIẾNG ĐẠI HỒNG CHUNG (TEMPLE BRONZE BELL)
  // --------------------------------------------------------------------------
  playTempleBell(intensity = 1.0) {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;

      // Hòa âm chuông đồng Bát Nhã truyền thống (Fundamental 144Hz trầm hùng)
      const base = 144;
      const partials = [
        { ratio: 0.5, amp: 0.28, decay: 5.5 },   // Tiếng rền trầm (Hum note)
        { ratio: 1.0, amp: 0.42, decay: 4.8 },   // Tiếng chuông chính (Prime)
        { ratio: 1.48, amp: 0.22, decay: 3.4 },  // Tierce (Hòa ba)
        { ratio: 2.02, amp: 0.20, decay: 2.6 },  // Quint (Hòa năm)
        { ratio: 2.96, amp: 0.14, decay: 1.8 }   // Overtone cao
      ];

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.32 * Math.min(1.0, intensity), now);
      master.connect(this.masterGain || ctx.destination);

      partials.forEach((p, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base * p.ratio + (Math.random() - 0.5) * 0.8, now);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(p.amp, now + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(g);
        g.connect(master);
        osc.onended = () => {
          osc.disconnect();
          g.disconnect();
          if (idx === 0) master.disconnect();
        };
        osc.start(now);
        osc.stop(now + p.decay + 0.05);
      });
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 4. TIẾNG LẮC ỐNG XĂM TRE (FORTUNE STICK SHAKER)
  // --------------------------------------------------------------------------
  playFortuneShake() {
    if (!this.sfxEnabled) return;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playWoodenFish(1.36 + (i % 2) * 0.18 + Math.random() * 0.08);
      }, i * 115);
    }
  }

  // --------------------------------------------------------------------------
  // 5. TIẾNG CHUÔNG NGỌC DÂNG LỄ (SINGING CHIME 528Hz & 660Hz)
  // --------------------------------------------------------------------------
  playIncenseChime() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;
      const notes = [528, 660, 792];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.09 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.25);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.3);
      });
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 6. ZEROTTS VOICE QUEUE & AUDIO PLAYBACK
  // --------------------------------------------------------------------------
  enqueueTts(text, options = {}) {
    const onStart = typeof options.onStart === 'function' ? options.onStart : null;
    const onEnd = typeof options.onEnd === 'function' ? options.onEnd : null;

    if (!this.ttsEnabled) {
      if (onStart) onStart();
      if (onEnd) setTimeout(onEnd, 5500);
      return;
    }
    const clean = String(text || '').trim();
    if (!clean) {
      if (onStart) onStart();
      if (onEnd) setTimeout(onEnd, 5500);
      return;
    }

    if (this.ttsQueue.length >= 6) {
      const dropped = this.ttsQueue.shift();
      if (dropped?.onStart) dropped.onStart();
      if (dropped?.onEnd) dropped.onEnd();
    }

    const item = {
      id: `tts_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text: clean,
      voice: (options.voice || this.ttsVoice || 'maichi').toLowerCase(),
      url: options.url || null,
      onStart,
      onEnd,
      fetchPromise: null
    };

    if (!item.url) {
      item.fetchPromise = this.fetchZeroTtsAudio(item.text, item.voice);
    }

    this.ttsQueue.push(item);
    this.processTtsQueue();
  }

  async fetchZeroTtsAudio(text, voice = 'maichi') {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice })
      });
      const data = await res.json();
      if (data && data.ok && data.url) {
        return data;
      }
      return { ok: false, error: data?.error || 'ZeroTTS unavailable' };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async processTtsQueue() {
    if (this.ttsPlaying || this.ttsQueue.length === 0) return;
    this.ttsPlaying = true;
    const item = this.ttsQueue.shift();

    try {
      let audioUrl = item.url;
      if (!audioUrl && item.fetchPromise) {
        const res = await item.fetchPromise;
        if (res && res.ok && res.url) {
          audioUrl = res.url;
        }
      }

      if (audioUrl) {
        this.setBgDucking(true);
        if (this.onTtsStateChange) {
          this.onTtsStateChange({ speaking: true, synthesizing: false, text: item.text });
        }
        if (item.onStart) item.onStart();
        await this.playWavUrl(audioUrl);
        if (item.onEnd) item.onEnd();
      } else {
        if (item.onStart) item.onStart();
        if (item.onEnd) setTimeout(item.onEnd, 5500);
      }
    } catch (err) {
      console.warn('[ZeroTTS Playback Warning]', err);
      if (item.onStart) item.onStart();
      if (item.onEnd) item.onEnd();
    } finally {
      this.ttsPlaying = false;
      if (this.ttsQueue.length === 0) {
        this.setBgDucking(false);
        if (this.onTtsStateChange) {
          this.onTtsStateChange({ speaking: false, synthesizing: false, text: '' });
        }
      } else {
        setTimeout(() => this.processTtsQueue(), 250);
      }
    }
  }

  playWavUrl(url) {
    return new Promise((resolve) => {
      if (this.isPreview || !this.ttsEnabled || this.ttsVolume <= 0.01) {
        return resolve();
      }
      try {
        const audio = new Audio(url);
        this.currentAudio = audio;
        audio.volume = this.ttsVolume;
        audio.onended = () => {
          this.currentAudio = null;
          resolve();
        };
        audio.onerror = () => {
          this.currentAudio = null;
          resolve();
        };
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            this.currentAudio = null;
            resolve();
          });
        }
      } catch (_) {
        resolve();
      }
    });
  }
}

window.TempleAudioEngine = TempleAudioEngine;
