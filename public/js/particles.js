/**
 * Ultra-Smooth 60 FPS Sacred Temple Canvas Particle Engine
 * Tối ưu hóa tối đa cho OBS Studio / TikTok Live:
 * - Delta-Time Adaptive 60 FPS Animation: Chuyển động mượt mà như nhung bất kể tần số quét.
 * - Offscreen Sprite Pre-rendering: Khói hương, Hạt bụi vàng, Cánh hoa sen, Hoa đăng & Tim bồ đề.
 * - GPU Compositor Fast Path: Làm tròn tọa độ nguyên (integer blitting) triệt tiêu subpixel overhead.
 * - Tự động tạm dừng khi tab ẩn để tiết kiệm 100% GPU/CPU khi không live.
 */
class TempleParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.width = 1080;
    this.height = 1920;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.smokeParticles = [];
    this.lotusPetals = [];
    this.goldSparks = [];
    this.soundWaves = [];
    this.floatingTexts = [];
    this.burstParticles = [];
    this.heartParticles = [];

    this.incenseTips = [];
    this.smokeDensity = 1.0;
    this.time = 0;
    this.lastTimestamp = performance.now();

    this.buildOffscreenSprites();
    this.initAmbientParticles();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildOffscreenSprites() {
    // 1. Smoke Sprite (80x80) - Khói trầm hương đa tầng
    this.smokeSprite = document.createElement('canvas');
    this.smokeSprite.width = 80;
    this.smokeSprite.height = 80;
    const sctx = this.smokeSprite.getContext('2d');
    const sgrad = sctx.createRadialGradient(40, 40, 4, 40, 40, 38);
    sgrad.addColorStop(0, 'rgba(255, 248, 225, 0.75)');
    sgrad.addColorStop(0.35, 'rgba(245, 230, 195, 0.45)');
    sgrad.addColorStop(0.7, 'rgba(225, 205, 170, 0.18)');
    sgrad.addColorStop(1, 'rgba(200, 180, 150, 0)');
    sctx.fillStyle = sgrad;
    sctx.beginPath();
    sctx.arc(40, 40, 38, 0, Math.PI * 2);
    sctx.fill();

    // 2. Gold Spark Sprite (24x24) - Bụi vàng tâm linh tỏa tia
    this.sparkSprite = document.createElement('canvas');
    this.sparkSprite.width = 24;
    this.sparkSprite.height = 24;
    const gctx = this.sparkSprite.getContext('2d');
    const ggrad = gctx.createRadialGradient(12, 12, 1, 12, 12, 11);
    ggrad.addColorStop(0, 'rgba(255, 255, 240, 1)');
    ggrad.addColorStop(0.3, 'rgba(255, 230, 120, 0.9)');
    ggrad.addColorStop(0.7, 'rgba(245, 185, 50, 0.4)');
    ggrad.addColorStop(1, 'rgba(230, 150, 30, 0)');
    gctx.fillStyle = ggrad;
    gctx.beginPath();
    gctx.arc(12, 12, 11, 0, Math.PI * 2);
    gctx.fill();

    // 3. Lotus Petal Sprites (36x36) - Cánh hoa sen hồng & sen vàng
    this.pinkPetalSprite = this.createPetalSprite('#f8a5c2', '#f78fb3');
    this.goldPetalSprite = this.createPetalSprite('#ffe082', '#ffca28');

    // 4. Floating Bodhi Heart Sprite (28x28) - Trái tim Bồ Đề thả tim TikTok
    this.heartSprite = document.createElement('canvas');
    this.heartSprite.width = 28;
    this.heartSprite.height = 28;
    const hctx = this.heartSprite.getContext('2d');
    hctx.translate(14, 15);
    hctx.beginPath();
    hctx.moveTo(0, 7);
    hctx.bezierCurveTo(-10, -3, -11, -11, -5, -11);
    hctx.bezierCurveTo(0, -11, 0, -6, 0, -6);
    hctx.bezierCurveTo(0, -6, 0, -11, 5, -11);
    hctx.bezierCurveTo(11, -11, 10, -3, 0, 7);
    hctx.fillStyle = '#ff7675';
    hctx.fill();
  }

  createPetalSprite(c1, c2) {
    const c = document.createElement('canvas');
    c.width = 36;
    c.height = 36;
    const pctx = c.getContext('2d');
    const sz = 14;
    pctx.translate(18, 18);
    pctx.beginPath();
    pctx.moveTo(0, -sz);
    pctx.bezierCurveTo(sz * 0.85, -sz * 0.35, sz * 0.75, sz * 0.75, 0, sz);
    pctx.bezierCurveTo(-sz * 0.75, sz * 0.75, -sz * 0.85, -sz * 0.35, 0, -sz);
    const grad = pctx.createLinearGradient(0, -sz, 0, sz);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    pctx.fillStyle = grad;
    pctx.fill();
    return c;
  }

  initAmbientParticles() {
    for (let i = 0; i < 28; i++) {
      this.goldSparks.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 10 + Math.random() * 12,
        vy: -(25 + Math.random() * 45),
        vx: (Math.random() - 0.5) * 18,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.4 + Math.random() * 0.6
      });
    }

    for (let i = 0; i < 12; i++) {
      this.lotusPetals.push(this.createLotusPetal(true));
    }
  }

  createLotusPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30 - Math.random() * 120,
      scale: 0.65 + Math.random() * 0.6,
      vy: 55 + Math.random() * 75,
      vx: (Math.random() - 0.5) * 40,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 1.8,
      swayPhase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.55
    };
  }

  setIncenseTips(tips) {
    this.incenseTips = Array.isArray(tips) ? tips : [];
  }

  spawnSmokeFromTips() {
    if (!this.incenseTips.length || this.smokeParticles.length >= 28) return;
    if (Math.random() > 0.55 * this.smokeDensity) return;

    const tip = this.incenseTips[Math.floor(Math.random() * this.incenseTips.length)];
    this.smokeParticles.push({
      x: tip.x + (Math.random() - 0.5) * 8,
      y: tip.y,
      vx: (Math.random() - 0.5) * 12,
      vy: -(95 + Math.random() * 45),
      radius: 9 + Math.random() * 6,
      maxRadius: 36 + Math.random() * 20,
      alpha: 0.28 + Math.random() * 0.12,
      age: 0,
      maxAge: 2.2 + Math.random() * 0.8,
      seed: Math.random() * 50
    });
  }

  spawnIncenseBurst(x = 540, y = 890) {
    for (let i = 0; i < 22; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
      const speed = 120 + Math.random() * 240;
      this.burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 3 + Math.random() * 3.5,
        alpha: 1,
        decay: 1.2 + Math.random() * 0.8,
        color: i % 2 === 0 ? '#ffdf85' : '#ff9e44'
      });
    }
  }

  spawnBellWave(x = 540, y = 510, count = 3) {
    for (let i = 0; i < count; i++) {
      this.soundWaves.push({
        x,
        y,
        radius: 30 + i * 35,
        maxRadius: 480 + i * 60,
        speed: 280 + i * 20,
        alpha: 0.8 - i * 0.15,
        lineWidth: 3.5 - i * 0.7
      });
    }
  }

  spawnWoodenFishHeart(x = 890, y = 940) {
    if (this.heartParticles.length > 25) this.heartParticles.shift();
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    const speed = 90 + Math.random() * 110;
    this.heartParticles.push({
      x: x + (Math.random() - 0.5) * 30,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      scale: 0.8 + Math.random() * 0.5,
      alpha: 1.0,
      decay: 0.85
    });
  }

  spawnFloatingMerit(text = '+1 Công Đức', x = 540, y = 940, color = '#ffe082') {
    if (this.floatingTexts.length > 10) this.floatingTexts.shift();
    this.floatingTexts.push({
      text,
      x: x + (Math.random() - 0.5) * 44,
      y,
      vy: -110,
      alpha: 1.0,
      decay: 0.85,
      color
    });
  }

  spawnGrandCeremonyRain() {
    for (let i = 0; i < 20; i++) {
      this.lotusPetals.push(this.createLotusPetal(false));
    }
    for (let i = 0; i < 48; i++) {
      const angle = (Math.PI * 2 * i) / 48;
      const speed = 140 + Math.random() * 320;
      this.burstParticles.push({
        x: 540,
        y: 510,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 3.2 + Math.random() * 4.0,
        alpha: 1,
        decay: 0.75 + Math.random() * 0.5,
        color: i % 3 === 0 ? '#fff3b0' : i % 3 === 1 ? '#ffca28' : '#ff7675'
      });
    }
  }

  animate(now) {
    requestAnimationFrame(this.animate);
    if (document.hidden) {
      this.lastTimestamp = now;
      return;
    }

    const dt = Math.min(0.05, (now - this.lastTimestamp) / 1000);
    this.lastTimestamp = now;
    this.time += dt;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Hạt bụi vàng tâm linh (Golden stardust)
    for (let i = 0; i < this.goldSparks.length; i++) {
      const sp = this.goldSparks[i];
      sp.y += sp.vy * dt;
      sp.x += (sp.vx + Math.sin(this.time * 2.2 + sp.phase) * 15) * dt;
      if (sp.y < -20) {
        sp.y = this.height + 20;
        sp.x = Math.random() * this.width;
      }
      ctx.globalAlpha = sp.alpha * (0.6 + 0.4 * Math.sin(this.time * 3.5 + sp.phase));
      ctx.drawImage(this.sparkSprite, (sp.x - sp.size * 0.5) | 0, (sp.y - sp.size * 0.5) | 0, sp.size | 0, sp.size | 0);
    }

    // 2. Khói tâm hương uốn lượn đa tầng
    this.spawnSmokeFromTips();
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.age += dt;
      if (p.age >= p.maxAge || p.y < 485) {
        this.smokeParticles.splice(i, 1);
        continue;
      }
      const progress = p.age / p.maxAge;
      const curl = Math.sin(this.time * 2.5 + p.seed + p.y * 0.015) * 22;
      p.x += (p.vx + curl) * dt;
      p.y += p.vy * dt;

      const r = p.radius + (p.maxRadius - p.radius) * progress;
      const fade = Math.sin(progress * Math.PI) * p.alpha * (1 - progress * 0.5);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.drawImage(this.smokeSprite, (p.x - r) | 0, (p.y - r) | 0, (r * 2) | 0, (r * 2) | 0);
    }

    // 3. Cánh hoa sen rơi bồng bềnh
    ctx.globalAlpha = 1;
    for (let i = this.lotusPetals.length - 1; i >= 0; i--) {
      const petal = this.lotusPetals[i];
      petal.y += petal.vy * dt;
      petal.x += (petal.vx + Math.sin(this.time * 2.0 + petal.swayPhase) * 35) * dt;
      petal.rot += petal.vrot * dt;

      if (petal.y > this.height + 40) {
        if (this.lotusPetals.length > 12) {
          this.lotusPetals.splice(i, 1);
          continue;
        } else {
          Object.assign(petal, this.createLotusPetal(false));
        }
      }

      ctx.save();
      ctx.translate(petal.x | 0, petal.y | 0);
      ctx.rotate(petal.rot);
      const sz = (36 * petal.scale) | 0;
      ctx.drawImage(
        petal.gold ? this.goldPetalSprite : this.pinkPetalSprite,
        (-sz * 0.5) | 0,
        (-sz * 0.5) | 0,
        sz,
        sz
      );
      ctx.restore();
    }

    // 4. Trái tim Bồ Đề bay lên khi gõ mõ / thả tim
    for (let i = this.heartParticles.length - 1; i >= 0; i--) {
      const hp = this.heartParticles[i];
      hp.x += hp.vx * dt;
      hp.y += hp.vy * dt;
      hp.alpha -= hp.decay * dt;
      if (hp.alpha <= 0) {
        this.heartParticles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, hp.alpha);
      ctx.translate(hp.x | 0, hp.y | 0);
      const sz = (28 * hp.scale) | 0;
      ctx.drawImage(this.heartSprite, (-sz * 0.5) | 0, (-sz * 0.5) | 0, sz, sz);
      ctx.restore();
    }

    // 5. Sóng âm Đại Hồng Chung ngân vang
    for (let i = this.soundWaves.length - 1; i >= 0; i--) {
      const w = this.soundWaves[i];
      w.radius += w.speed * dt;
      w.alpha -= 0.65 * dt;
      if (w.radius >= w.maxRadius || w.alpha <= 0.02) {
        this.soundWaves.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, w.alpha);
      ctx.strokeStyle = '#ffe57f';
      ctx.lineWidth = w.lineWidth;
      ctx.beginPath();
      ctx.arc(w.x | 0, w.y | 0, w.radius | 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 6. Hạt pháo hoa sen bùng sáng
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const b = this.burstParticles[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vy += 180 * dt;
      b.alpha -= b.decay * dt;
      if (b.alpha <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, b.alpha);
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x | 0, b.y | 0, b.r | 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Chữ +Công Đức & Điểm lành bay lên óng ánh
    if (this.floatingTexts.length > 0) {
      ctx.font = '800 28px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = 'rgba(12, 3, 2, 0.95)';
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= ft.decay * dt;
        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.strokeText(ft.text, ft.x | 0, ft.y | 0);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x | 0, ft.y | 0);
      }
    }

    ctx.globalAlpha = 1;
  }
}

window.TempleParticleEngine = TempleParticleEngine;
