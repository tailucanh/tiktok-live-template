/**
 * Live 9:16 Client Controller — Chánh Điện Đức Phật A Di Đà & Đạo Tràng Phật Tử Quỳ Lễ
 * - Hiển thị 6 Đệm Quỳ VIP (Top 6 Bảng Vàng Công Đức)
 * - Hiển thị 40 Phật Tử mặc áo lam quỳ hai bên thảm đỏ + thẻ tên người xem
 * - Hiệu ứng người xem bước dọc thảm đỏ lên trước Lư Hương Đồng dâng hương
 * - Giọng đọc ZeroTTS (Mai Chi) + Pháp khí Web Audio
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const isObs = params.get('obs') === '1';
  const isPreview = params.get('preview') === '1';

  if (isObs) {
    document.body.classList.add('obs-mode');
  }

  // 1. Tự động co giãn khung 1080x1920 vừa khít Stage Wrapper (9:16) — Bảo toàn 100% hình ảnh không bị cắt xén
  const stageWrapper = document.getElementById('stageWrapper');
  const stage9x16 = document.getElementById('stage9x16');

  function fitStage() {
    if (!stageWrapper || !stage9x16) return;
    const rect = stageWrapper.getBoundingClientRect();
    let w = rect.width;
    let h = rect.height;
    if (!w || !h || h < 40) {
      w = stageWrapper.clientWidth || window.innerWidth;
      h = stageWrapper.clientHeight || window.innerHeight;
    }
    const scale = Math.max(0.05, Math.min(w / 1080, h / 1920));
    const offsetX = Math.max(0, (w - 1080 * scale) / 2);
    const offsetY = Math.max(0, (h - 1920 * scale) / 2);
    stage9x16.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  }
  window.addEventListener('resize', fitStage);
  if (window.ResizeObserver && stageWrapper) {
    try {
      new ResizeObserver(() => fitStage()).observe(stageWrapper);
    } catch (_) {}
  }
  fitStage();

  // 1B. 4 BỐI CẢNH CHÁNH ĐIỆN & CHÚ TIỂU 3D GÕ MÕ
  const SCENE_CONFIGS = {
    amitabha: {
      name: 'Đức Phật A Di Đà',
      title: 'CHÙA LINH ỨNG • ĐỨC PHẬT A DI ĐÀ',
      imagePng: '/assets/amitabha_stage.png',
      imageJpg: '/assets/amitabha_stage.jpg',
      haloTop: '410px',
      lightTop: '440px'
    },
    shakyamuni: {
      name: 'Đức Bổn Sư Thích Ca Mâu Ni Phật',
      title: 'CHÙA LINH ỨNG • ĐỨC BỔN SƯ THÍCH CA MÂU NI PHẬT',
      imagePng: '/assets/shakyamuni_stage.png',
      imageJpg: '/assets/shakyamuni_stage.jpg',
      haloTop: '470px',
      lightTop: '490px'
    },
    avalokiteshvara: {
      name: 'Đức Quán Thế Âm Bồ Tát',
      title: 'CHÙA LINH ỨNG • NAM MÔ QUÁN THẾ ÂM BỒ TÁT',
      imagePng: '/assets/avalokiteshvara_stage.png',
      imageJpg: '/assets/avalokiteshvara_stage.jpg',
      haloTop: '350px',
      lightTop: '370px'
    },
    lantern: {
      name: 'Đêm Đại Lễ Hoa Đăng Cầu An',
      title: 'CHÙA LINH ỨNG • ĐÊM ĐẠI LỄ HOA ĐĂNG CẦU AN',
      imagePng: '/assets/amitabha_stage.png',
      imageJpg: '/assets/amitabha_stage.jpg',
      haloTop: '410px',
      lightTop: '440px'
    }
  };

  let currentActiveScene = '';
  function applyScene(sceneName) {
    if (!sceneName || !SCENE_CONFIGS[sceneName]) sceneName = 'amitabha';
    if (sceneName === currentActiveScene) return;
    currentActiveScene = sceneName;
    const cfg = SCENE_CONFIGS[sceneName];

    const bgImg = document.querySelector('.sanctuary-bg-img');
    const stage = document.getElementById('stage9x16');
    const liveTitle = document.getElementById('liveStatusText');
    const halo = document.getElementById('buddhaHaloSystem');
    const lightBeam = document.getElementById('sacredLightBeam');

    if (liveTitle) liveTitle.textContent = cfg.title;
    if (halo && cfg.haloTop) halo.style.top = cfg.haloTop;
    if (lightBeam && cfg.lightTop) lightBeam.style.top = cfg.lightTop;

    if (stage) {
      stage.className = stage.className.replace(/\bscene-\w+\b/g, '').trim();
      stage.classList.add(`scene-${sceneName}`);
    }

    if (bgImg) {
      bgImg.dataset.sceneLoaded = sceneName;
      bgImg.src = cfg.imageJpg || cfg.imagePng;
      bgImg.style.opacity = '1';
    }
  }
  window.applyScene = applyScene;

  // Lắng nghe postMessage từ cửa sổ Admin để đổi cảnh tức thì 0ms
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'switchScene') {
      applyScene(event.data.scene);
    }
  });

  // 1C. Chú Tiểu 3D gõ mõ tự tại
  const monk3dWrapper = document.getElementById('monk3dWrapper');
  const monkSpeechBubble = document.getElementById('monkSpeechBubble');
  let monkBubbleResetTimer = null;

  function triggerMonkStrike(phrase) {
    if (monk3dWrapper) {
      monk3dWrapper.classList.remove('striking');
      void monk3dWrapper.offsetWidth;
      monk3dWrapper.classList.add('striking');
    }
    if (monkSpeechBubble) {
      const strikePhrases = ['Cốc! +1 Công Đức 🙏', 'A Di Đà Phật 🪷', 'Tâm An Vạn Sự An ✨', 'Phước Lành Vô Lượng 🌟', 'Thành Tâm Đảnh Lễ 🪷'];
      monkSpeechBubble.textContent = phrase || strikePhrases[Math.floor(Math.random() * strikePhrases.length)];
      clearTimeout(monkBubbleResetTimer);
      monkBubbleResetTimer = setTimeout(() => {
        if (monkSpeechBubble) monkSpeechBubble.textContent = 'A Di Đà Phật 🙏';
      }, 2400);
    }
  }

  // 2. Khởi tạo Particle Engine & Audio Engine (ZeroTTS Mai Chi)
  const canvas = document.getElementById('templeCanvas');
  const particles = new window.TempleParticleEngine(canvas);
  const audio = new window.TempleAudioEngine();

  // Tự động kích hoạt Audio Engine trong OBS Browser Source (không cần tương tác người dùng)
  if (isObs && !isPreview) {
    try {
      audio.ensureContext();
    } catch (_) {}
  }

  function unlockAudioOnce() {
    audio.ensureContext();
    const btnUnlock = document.getElementById('btnUnlockAudio');
    if (btnUnlock) {
      btnUnlock.textContent = '✅ Âm Thanh Chùa Đã Sẵn Sàng';
      btnUnlock.classList.remove('gold');
      btnUnlock.classList.add('active-toggle');
    }
  }
  window.addEventListener('pointerdown', unlockAudioOnce, { once: true });
  window.addEventListener('click', unlockAudioOnce, { once: true });
  window.addEventListener('keydown', unlockAudioOnce, { once: true });

  // 3. Vẽ các nén nhang đang cháy trong Lư Hương Đỉnh Đồng (x=540, y=895)
  const incenseHolder = document.getElementById('incenseSticksHolder');
  let renderedStickCount = 0;

  function renderIncenseSticks(count) {
    const target = Math.max(3, Math.min(27, Number(count) || 9));
    if (target === renderedStickCount && incenseHolder.children.length > 0) return;
    renderedStickCount = target;
    incenseHolder.innerHTML = '';

    const tips = [];
    for (let i = 0; i < target; i++) {
      const stick = document.createElement('div');
      stick.className = 'incense-stick';

      const spread = target === 1 ? 0 : (i / (target - 1) - 0.5) * 2;
      const leftPx = 65 + spread * 28 + Math.sin(i * 2.1) * 2;
      const angleDeg = spread * 12 + Math.cos(i * 1.5) * 1.5;
      const heightPx = 76 + (i % 3) * 6;

      stick.style.left = `${leftPx}px`;
      stick.style.height = `${heightPx}px`;
      stick.style.transform = `rotate(${angleDeg}deg)`;

      const ember = document.createElement('div');
      ember.className = 'incense-ember';
      ember.style.animationDelay = `${(i * 0.15) % 1.1}s`;
      stick.appendChild(ember);
      incenseHolder.appendChild(stick);

      const rad = (angleDeg * Math.PI) / 180;
      const tipX = 540 + (leftPx - 65) + Math.sin(rad) * heightPx;
      const tipY = 1205 - Math.cos(rad) * heightPx;
      tips.push({ x: tipX, y: tipY });
    }
    particles.setIncenseTips(tips);
  }

  // 4. Dựng Hàng 6 Đệm Quỳ VIP (Top 6 Thí Chủ trang nghiêm hai bên thảm đỏ y=1390)
  const VIP_CUSHION_COORDS = [
    { x: 175, y: 1390, rank: 1 },
    { x: 275, y: 1390, rank: 2 },
    { x: 375, y: 1390, rank: 3 },
    { x: 705, y: 1390, rank: 4 },
    { x: 805, y: 1390, rank: 5 },
    { x: 905, y: 1390, rank: 6 }
  ];

  function renderVipCushions(leaderboard = []) {
    const layer = document.getElementById('vipCushionsLayer');
    if (!layer) return;

    layer.innerHTML = VIP_CUSHION_COORDS.map((slot, idx) => {
      const dev = leaderboard[idx];
      if (!dev) return '';
      return `
        <div class="vip-devotee-slot" style="left: ${slot.x}px; top: ${slot.y}px; z-index: ${12 + idx};">
          <img src="/assets/devotee.png" alt="VIP Devotee" class="devotee-sprite" />
          <div class="vip-rank-pill">
            <span class="vip-rank-num">${slot.rank}</span>
            <span class="vip-rank-name">${escapeHtml(shortenName(dev.name, 12))}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // 5. Dựng Đạo Tràng 24 Chỗ Ngồi Ngay Ngắn (4 Hàng x 3 Cột mỗi bên, chuẩn kích thước bồ đoàn hoa sen)
  const congregationHall = document.getElementById('congregationHall');
  const HALL_SEAT_COORDS = [];
  const newlySeatedUsers = new Set();

  (function buildHallGrid() {
    const rows = 4;
    const colsPerSide = 3;
    for (let r = 0; r < rows; r++) {
      const progress = r / (rows - 1); // 0 (xa) -> 1 (gần)
      // 4 hàng bồ đoàn từ y=1470 đến y=1720, trải đều không chồng chéo
      const y = Math.round(1470 + progress * 250);
      const scale = +(0.72 + progress * 0.22).toFixed(2);

      // Cánh trái thảm đỏ: 3 cột khớp với 3 hàng đệm bồ đoàn sen
      const leftInnerX = Math.round(365 - progress * 20);
      const leftOuterX = 145;
      for (let c = 0; c < colsPerSide; c++) {
        const t = c / (colsPerSide - 1);
        const x = Math.round(leftInnerX - t * (leftInnerX - leftOuterX));
        HALL_SEAT_COORDS.push({ side: 'L', row: r, col: c, x, y, scale });
      }

      // Cánh phải thảm đỏ: 3 cột khớp với 3 hàng đệm bồ đoàn sen
      const rightInnerX = Math.round(715 + progress * 20);
      const rightOuterX = 935;
      for (let c = 0; c < colsPerSide; c++) {
        const t = c / (colsPerSide - 1);
        const x = Math.round(rightInnerX + t * (rightOuterX - rightInnerX));
        HALL_SEAT_COORDS.push({ side: 'R', row: r, col: c, x, y, scale });
      }
    }
  })();

  let lastRenderedLeaderboardJson = '';

  function renderCongregationHall(leaderboard = []) {
    if (!congregationHall) return;
    const hallViewers = leaderboard.slice(6);
    const sig = JSON.stringify(hallViewers.map((d) => `${d.name}:${d.merit}`));
    if (sig === lastRenderedLeaderboardJson && congregationHall.children.length > 0) return;
    lastRenderedLeaderboardJson = sig;

    congregationHall.innerHTML = HALL_SEAT_COORDS.map((seat, idx) => {
      const viewer = hallViewers[idx];
      const isNew = viewer && newlySeatedUsers.has(viewer.name);
      if (isNew) {
        setTimeout(() => newlySeatedUsers.delete(viewer.name), 3500);
      }

      const badgeHtml = viewer
        ? `
          <div class="seat-badge">
            <span class="seat-avatar">${
              viewer.avatar
                ? `<img src="${escapeHtml(viewer.avatar)}" alt="" />`
                : escapeHtml(String(viewer.name || 'P').charAt(0).toUpperCase())
            }</span>
            <span class="seat-username">${escapeHtml(shortenName(viewer.name, 11))}</span>
          </div>
        `
        : '';

      return `
        <div
          class="hall-seat ${isNew ? 'seated-active' : ''}"
          data-seat-idx="${idx}"
          style="left: ${seat.x}px; top: ${seat.y}px; z-index: ${20 + seat.row * 2}; transform: translate(-50%, -100%) scale(${seat.scale});"
        >
          <img
            src="/assets/devotee.png"
            alt="Phật tử"
            class="devotee-sprite"
            style="animation-delay: ${((idx * 0.22) % 3.5).toFixed(2)}s;"
          />
          ${badgeHtml}
        </div>
      `;
    }).join('');
  }

  // Preload toàn bộ 8 frame nhân vật vào bộ nhớ để chuyển frame mượt 0ms
  const SPRITE_FRAMES = {
    walk1: '/assets/devotee_walk.png',
    walk2: '/assets/devotee_walk_2.png',
    kneelDown: '/assets/devotee_kneel_down.png',
    kneel: '/assets/devotee.png',
    forehead: '/assets/devotee_bow.png',
    bowMid: '/assets/devotee_bow_mid.png',
    prostrate: '/assets/devotee_prostrate.png',
    prostrateDeep: '/assets/devotee_prostrate_deep.png'
  };
  Object.values(SPRITE_FRAMES).forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  function pulseHallBowing() {
    if (!congregationHall) return;
    const seats = congregationHall.querySelectorAll('.hall-seat');
    seats.forEach((el, i) => {
      if (i % 4 !== 0) return;
      const img = el.querySelector('.devotee-sprite');
      if (!img) return;
      const delay = (i % 4) * 80;
      setTimeout(() => { img.src = SPRITE_FRAMES.forehead; }, delay);
      setTimeout(() => { img.src = SPRITE_FRAMES.bowMid; }, delay + 140);
      setTimeout(() => { img.src = SPRITE_FRAMES.prostrateDeep; }, delay + 300);
      setTimeout(() => { img.src = SPRITE_FRAMES.bowMid; }, delay + 620);
      setTimeout(() => { img.src = SPRITE_FRAMES.kneel; }, delay + 780);
    });
  }

  let prostrationTimers = [];
  function clearProstrationTimers() {
    while (prostrationTimers.length > 0) {
      clearTimeout(prostrationTimers.pop());
    }
  }

  // Chuyển đổi tức thời giữa 8 khung hình đã giải mã sẵn trên GPU (KHÔNG BAO GIỜ BỊ MẤT HÌNH)
  function setCentralPose(poseKey) {
    const stack = document.getElementById('centralSpriteStack');
    if (!stack) return;
    const frames = stack.querySelectorAll('.pose-frame');
    frames.forEach((img) => {
      img.classList.toggle('active', img.getAttribute('data-pose') === poseKey);
    });
  }

  function schedulePose(ms, poseKey) {
    prostrationTimers.push(
      setTimeout(() => {
        setCentralPose(poseKey);
      }, ms)
    );
  }

  // Chuỗi 8 khung hình Đảnh lễ Tam Bái mượt mà (Hạ gối -> Chắp tay ngực -> Đưa lên trán -> Nghiêng 45° -> Chống tay -> Lạy sát đất -> Ngẩng lên)
  function playThreeBowsSequence(startDelayMs = 0) {
    schedulePose(startDelayMs, 'kneelDown');
    schedulePose(startDelayMs + 160, 'kneel');

    const bowOffsets = [startDelayMs + 320, startDelayMs + 1820, startDelayMs + 3320];
    bowOffsets.forEach((t0) => {
      schedulePose(t0, 'forehead');            // 1. Chắp tay đưa lên trán
      schedulePose(t0 + 170, 'bowMid');        // 2. Cúi gập lưng 45°
      schedulePose(t0 + 330, 'prostrate');     // 3. Vươn hai tay chống xuống đệm
      schedulePose(t0 + 490, 'prostrateDeep'); // 4. Lạy sát đất (Ngũ thể đầu địa)
      schedulePose(t0 + 860, 'prostrate');     // 5. Bắt đầu nâng đầu lên
      schedulePose(t0 + 1020, 'bowMid');       // 6. Nâng lưng lên góc 45°
      schedulePose(t0 + 1180, 'kneel');        // 7. Ngồi quỳ thẳng lưng
    });

    schedulePose(startDelayMs + 4800, 'forehead');
    schedulePose(startDelayMs + 5350, 'kneel');
  }

  // Chu trình hoạt ảnh NPC Thí Chủ sống động liên tục (Không bao giờ đứng im như hình tĩnh)
  let npcIdleTimer = null;
  function startNpcLivingCycle() {
    clearInterval(npcIdleTimer);
    npcIdleTimer = setInterval(() => {
      // Khi không có sự kiện đảnh lễ lớn đang chạy: NPC tự động chắp tay cúi đầu niệm Phật nhẹ nhàng
      if (prostrationTimers.length === 0) {
        schedulePose(0, 'kneel');
        schedulePose(1200, 'forehead'); // Chắp tay lên trán cầu an
        schedulePose(2600, 'bowMid');   // Cúi nhẹ 45 độ
        schedulePose(4000, 'forehead'); // Nâng tay lên trán
        schedulePose(5200, 'kneel');    // Trở về thế quỳ chắp tay tịnh tâm
      }
    }, 11000);
  }
  startNpcLivingCycle();

  // Hiệu ứng thí chủ ĐỨNG ĐI BỘ từng bước dọc thảm đỏ rồi Hạ gối Quỳ Đảnh Lễ (trên cùng 1 nhân vật, không bao giờ mất hình)
  function animateWalkerOnCarpet(user, avatar, actionLabel, wish) {
    const centralEl = document.getElementById('centralWorshipper');
    if (!centralEl) return;

    clearProstrationTimers();
    updateCentralWorshipper(user, avatar, actionLabel, wish, false);

    // Khởi động bước đi từ cuối thảm đỏ lên chính điện
    centralEl.classList.remove('walking-up');
    void centralEl.offsetWidth;
    centralEl.classList.add('walking-up');

    setCentralPose('walk1');
    for (let step = 1; step <= 10; step++) {
      schedulePose(step * 185, step % 2 === 0 ? 'walk1' : 'walk2');
    }

    // Khi bước tới trước Lư Hương (2.05s): dừng bước, hạ gối quỳ xuống đệm và bắt đầu Đảnh lễ 3 lạy
    prostrationTimers.push(
      setTimeout(() => {
        centralEl.classList.remove('walking-up');
      }, 2100)
    );
    playThreeBowsSequence(2050);
  }

  function updateCentralWorshipper(user, avatar, actionLabel, wish, doThreeBows = true) {
    const nameEl = document.getElementById('centralName');
    const actEl = document.getElementById('centralAction');
    const wishEl = document.getElementById('centralWishBubble');
    const avatarEl = document.getElementById('centralAvatar');
    const beam = document.getElementById('sacredLightBeam');

    if (nameEl) nameEl.textContent = user || 'Thí Chủ Hữu Duyên';
    if (actEl) actEl.textContent = actionLabel || '✨ Dâng hương cầu an';
    if (wishEl) wishEl.textContent = `“${wish || 'Nam Mô A Di Đà Phật, cầu bình an cát tường'}”`;

    if (avatarEl) {
      if (avatar) {
        avatarEl.innerHTML = `<img src="${escapeHtml(avatar)}" alt="" />`;
      } else {
        avatarEl.textContent = String(user || '🙏').trim().charAt(0).toUpperCase();
      }
    }

    if (doThreeBows) {
      clearProstrationTimers();
      const centralEl = document.getElementById('centralWorshipper');
      if (centralEl) centralEl.classList.remove('walking-up');
      playThreeBowsSequence(0);
    }
    if (beam) {
      beam.classList.add('intense');
      setTimeout(() => beam.classList.remove('intense'), 4500);
    }

    const haloSys = document.getElementById('buddhaHaloSystem');
    const lotusHand = document.getElementById('lotusHandHalo');
    if (haloSys) {
      haloSys.classList.add('flare');
      setTimeout(() => haloSys.classList.remove('flare'), 3600);
    }
    if (lotusHand) {
      lotusHand.classList.add('flare');
      setTimeout(() => lotusHand.classList.remove('flare'), 3600);
    }
    particles.spawnBellWave(540, 260, 2);

    // Cập nhật dòng thông báo dưới thanh HUD
    const hudName = document.getElementById('devoteeNameLine');
    const hudAct = document.getElementById('devoteeActionTag');
    if (hudName) hudName.textContent = user || 'Thí Chủ';
    if (hudAct) hudAct.textContent = actionLabel || 'Dâng hương';
  }

  // 6. Cập nhật toàn bộ giao diện theo State từ Server
  let hasInitializedRealLeader = false;

  function updateUIState(st) {
    if (!st) return;

    if (st.currentScene) {
      applyScene(st.currentScene);
    }

    document.getElementById('statIncense').textContent = Number(st.totalIncense || 0).toLocaleString('vi-VN');
    document.getElementById('statMerit').textContent = Number(st.totalMerit || 0).toLocaleString('vi-VN');
    document.getElementById('statWoodenFish').textContent = Number(st.woodenFishHits || 0).toLocaleString('vi-VN');

    renderIncenseSticks(st.activeIncenseSticks || 9);

    const lb = Array.isArray(st.leaderboard) ? st.leaderboard : [];
    renderVipCushions(lb);
    renderCongregationHall(lb);


    // Đồng bộ tên Chủ Lễ mặc định theo người dẫn đầu thực tế nếu chưa có sự kiện mới
    if (!hasInitializedRealLeader && lb.length > 0) {
      hasInitializedRealLeader = true;
      const topDev = lb[0];
      updateCentralWorshipper(
        topDev.name,
        topDev.avatar,
        `✨ Công đức: ${Number(topDev.merit).toLocaleString('vi-VN')} CĐ`,
        topDev.lastWish || 'Nam Mô A Di Đà Phật, cầu bình an cát tường',
        false
      );
    }

    // Cập nhật Bảng TẤM LÒNG THÀNH ở góc dưới phải (Top 4)
    const lbList = document.getElementById('leaderboardList');
    if (lbList) {
      lbList.innerHTML = lb
        .slice(0, 4)
        .map(
          (item) => `
          <div class="leader-item">
            <span class="leader-rank">${item.rank}</span>
            <span class="leader-name">${escapeHtml(shortenName(item.name, 14))}</span>
            <span class="leader-merit">${Number(item.merit).toLocaleString('vi-VN')}</span>
          </div>
        `
        )
        .join('');
    }

    // Trạng thái kết nối TikTok Live
    const liveDot = document.getElementById('liveDot');
    const liveText = document.getElementById('liveStatusText');
    if (st.tiktok?.connected) {
      liveDot.classList.add('connected');
      liveText.textContent = `LIVE @${st.tiktok.username} • ${st.tiktok.viewerCount || 0} mắt`;
    } else if (st.tiktok?.connecting) {
      liveDot.classList.remove('connected');
      liveText.textContent = `Đang kết nối @${st.tiktok.username}...`;
    } else {
      liveDot.classList.remove('connected');
      liveText.textContent = st.settings?.autoSim
        ? 'CHÙA LINH ỨNG • TỰ ĐỘNG GIẢ LẬP ĐÔNG NGƯỜI'
        : 'CHÙA LINH ỨNG • ĐỨC PHẬT A DI ĐÀ';
    }

    const btnAutoSim = document.getElementById('btnToggleAutoSim');
    if (btnAutoSim && st.settings) {
      btnAutoSim.textContent = st.settings.autoSim
        ? '🤖 Tự động Giả lập Người Xem: ĐANG BẬT'
        : '🤖 Tự động Giả lập Người Xem: TẮT';
      btnAutoSim.classList.toggle('active-toggle', Boolean(st.settings.autoSim));
    }
    if (st.settings) {
      if (typeof st.settings.musicVolume === 'number') {
        audio.setMusicVolume(st.settings.musicVolume);
        const sMus = document.getElementById('sliderMusicVol');
        const vMus = document.getElementById('valMusicVol');
        const pct = Math.round(st.settings.musicVolume * 100);
        if (sMus) sMus.value = String(pct);
        if (vMus) vMus.textContent = `${pct}%`;
      }
      if (typeof st.settings.ttsVolume === 'number') {
        audio.setTtsVolume(st.settings.ttsVolume);
        const sTts = document.getElementById('sliderTtsVol');
        const vTts = document.getElementById('valTtsVol');
        const pct = Math.round(st.settings.ttsVolume * 100);
        if (sTts) sTts.value = String(pct);
        if (vTts) vTts.textContent = `${pct}%`;
      }
    }

    // Áp dụng Chế độ An Toàn TikTok Mobile (tránh che khuất hình ảnh & chữ)
    const isSafeMode = params.get('safe') === '0' ? false : (st.settings?.tiktokSafeMode !== false);
    stage9x16.classList.toggle('tiktok-safe-mode', isSafeMode);
    const btnSafeMode = document.getElementById('btnToggleSafeMode');
    if (btnSafeMode) {
      btnSafeMode.textContent = isSafeMode ? '🛡️ Safe Zone: BẬT' : '🛡️ Safe Zone: TẮT';
      btnSafeMode.classList.toggle('active-toggle', isSafeMode);
    }

    // Hiển thị Lưới Căn Chỉnh Vùng An Toàn TikTok
    const isSafeGuide = params.get('guide') === '1' || Boolean(st.settings?.showSafeGuide);
    const guideOverlay = document.getElementById('tiktokSafeGuideOverlay');
    if (guideOverlay) {
      guideOverlay.classList.toggle('visible', isSafeGuide);
    }
    const btnSafeGuide = document.getElementById('btnToggleSafeGuide');
    if (btnSafeGuide) {
      btnSafeGuide.textContent = isSafeGuide ? '📐 Lưới Căn: BẬT' : '📐 Lưới Căn: TẮT';
      btnSafeGuide.classList.toggle('active-toggle', isSafeGuide);
    }

    const feed = document.getElementById('eventFeed');
    if (feed && Array.isArray(st.recentEvents)) {
      feed.innerHTML = st.recentEvents
        .slice(0, 8)
        .map((ev) => `<div class="event-feed-item">${formatEventSummary(ev)}</div>`)
        .join('');
    }
  }

  function formatEventSummary(ev) {
    switch (ev.type) {
      case 'burnIncense':
        return `🔥 <strong>${escapeHtml(ev.user)}</strong> dâng ${ev.count} nén nhang (+${ev.merit} CĐ)`;
      case 'strikeWoodenFish':
        return `🪵 <strong>${escapeHtml(ev.user)}</strong> gõ mõ ${ev.count} nhịp (+${ev.merit} CĐ)`;
      case 'ringBell':
        return `🔔 <strong>${escapeHtml(ev.user)}</strong> thỉnh Đại Hồng Chung (+${ev.merit} CĐ)`;
      case 'sendPrayer':
        return `🏮 <strong>${escapeHtml(ev.user)}</strong> cầu phúc: “${escapeHtml(ev.wish)}”`;
      case 'offerGift':
      case 'grandCeremony':
        return `🪷 <strong>${escapeHtml(ev.user)}</strong> dâng <em>${escapeHtml(ev.giftName)}</em> (+${ev.merit} CĐ)`;
      case 'drawFortune':
        return `🎋 <strong>${escapeHtml(ev.user)}</strong> gieo được Quẻ số ${ev.fortune?.number} (${ev.fortune?.rank})`;
      default:
        return `✨ <strong>${escapeHtml(ev.user || 'Thí chủ')}</strong> tương tác`;
    }
  }

  // 7. Xử lý hiệu ứng khi có Nghi Thức mới
  let fortuneTimer = null;
  let grandTimer = null;

  function showWelcomeToast(user, avatar, message) {
    const wrapper = document.getElementById('welcomeBannerWrapper');
    if (!wrapper) return;
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    const avatarHtml = avatar
      ? `<img src="${escapeHtml(avatar)}" alt="" />`
      : escapeHtml(String(user || 'P').trim().charAt(0).toUpperCase());

    const welcomeMsg = message || `Hoan hỷ chào đón Thí Chủ vào Chánh Điện lễ Phật`;

    toast.innerHTML = `
      <div class="welcome-avatar">${avatarHtml}</div>
      <div class="welcome-content">
        <div class="welcome-title">🪷 ${escapeHtml(welcomeMsg)} 🪷</div>
        <div class="welcome-name">${escapeHtml(user)} • Nam Mô A Di Đà Phật</div>
      </div>
    `;
    wrapper.appendChild(toast);
    audio.playIncenseChime();

    if (user) {
      newlySeatedUsers.add(user);
    }

    setTimeout(() => {
      toast.remove();
    }, 4800);
  }

  function triggerRitualVisuals(ev) {
    if (!ev) return;

    if (ev.type === 'memberJoin') {
      showWelcomeToast(ev.user, ev.avatar, ev.welcomeText);
      return;
    }

    if (ev.ttsText && ev.type !== 'drawFortune') {
      audio.enqueueTts(ev.ttsText, { voice: ev.ttsVoice || 'maichi' });
    }

    switch (ev.type) {
      case 'burnIncense': {
        audio.playIncenseChime();
        particles.spawnIncenseBurst(540, 1180);
        particles.spawnFloatingMerit(`+${ev.merit} Công Đức`, 540, 1140, '#ffe082');
        animateWalkerOnCarpet(ev.user, ev.avatar, `🔥 Dâng ${ev.count} nén hương (+${ev.merit} CĐ)`, ev.wish);
        break;
      }

      case 'strikeWoodenFish': {
        audio.playWoodenFish();
        pulseHallBowing();
        triggerMonkStrike();
        particles.spawnWoodenFishHeart(890, 940);
        const praises = ['+1 Công Đức', 'Tâm An Lạc', 'Vạn Sự Như Ý', 'Cát Tường', 'Phước Dày', 'Bình An'];
        const text = praises[Math.floor(Math.random() * praises.length)];
        particles.spawnFloatingMerit(text, 890, 935, '#ffd54f');
        break;
      }

      case 'ringBell': {
        audio.playTempleBell(1.0);
        pulseHallBowing();
        particles.spawnBellWave(540, 510, 4);
        particles.spawnFloatingMerit(`+${ev.merit} Công Đức`, 190, 935, '#fff3b0');
        updateCentralWorshipper(ev.user, ev.avatar, `🔔 Thỉnh Đại Hồng Chung (+${ev.merit} CĐ)`, ev.wish);
        break;
      }

      case 'sendPrayer': {
        audio.playIncenseChime();
        spawnSkyLantern(ev.user, ev.wish);
        particles.spawnFloatingMerit(`+${ev.merit} Công Đức`, 540, 1260, '#ffb74d');
        animateWalkerOnCarpet(ev.user, ev.avatar, `🏮 Cầu phúc (+${ev.merit} CĐ)`, ev.wish);
        break;
      }

      case 'offerGift': {
        audio.playIncenseChime();
        audio.playTempleBell(0.85);
        particles.spawnIncenseBurst(540, 1180);
        particles.spawnFloatingMerit(`+${ev.merit} Công Đức`, 540, 1140, '#fff3b0');
        animateWalkerOnCarpet(ev.user, ev.avatar, `🪷 Dâng ${ev.giftName} (+${ev.merit} CĐ)`, ev.wish);
        break;
      }

      case 'grandCeremony': {
        audio.playTempleBell(1.2);
        setTimeout(() => audio.playTempleBell(1.1), 900);
        particles.spawnGrandCeremonyRain();
        pulseHallBowing();
        showGrandCeremonyBanner(ev.user, ev.giftName, ev.merit);
        animateWalkerOnCarpet(ev.user, ev.avatar, `🐉 ${ev.giftName} (+${ev.merit} CĐ)`, ev.wish);
        break;
      }

      case 'drawFortune': {
        enqueueFortune(ev);
        break;
      }
    }
  }

  // ============================================================================
  // HÀNG ĐỢI TRÌNH DIỄN QUẺ XĂM THÔNG MINH (60 FPS NON-BLOCKING QUEUE)
  // ============================================================================
  const fortuneQueue = [];
  let isPresentingFortune = false;

  function enqueueFortune(ev) {
    // 1. Luôn hiện ngay Mini Toast bên sườn để khán giả biết quẻ của mình đã được bốc thành công!
    spawnMiniFortuneToast(ev.user, ev.fortune?.number, ev.fortune?.rank, ev.topic);

    // 2. Đưa vào hàng đợi Sớ Hoàng Gia
    fortuneQueue.push(ev);
    updateFortuneQueueCounter();

    if (!isPresentingFortune) {
      processNextFortune();
    }
  }

  function spawnMiniFortuneToast(user, number, rank, topic) {
    const container = document.getElementById('miniFortuneContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'mini-fortune-toast';
    toast.innerHTML = `
      <span>🎋</span>
      <span class="mini-fortune-name">${escapeHtml(shortenName(user, 11))}</span>
      <span class="mini-fortune-badge">Quẻ #${number || 1} ${escapeHtml(rank || 'Cát')}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  function updateFortuneQueueCounter() {
    const pill = document.getElementById('fortuneQueuePill');
    if (!pill) return;
    const count = fortuneQueue.length;
    if (count > 0) {
      pill.textContent = `🏮 Đang chờ: ${count} quẻ`;
      pill.style.display = 'inline-block';
    } else {
      pill.style.display = 'none';
    }
  }

  function processNextFortune() {
    if (fortuneQueue.length === 0) {
      isPresentingFortune = false;
      updateFortuneQueueCounter();
      return;
    }

    isPresentingFortune = true;
    const ev = fortuneQueue.shift();
    updateFortuneQueueCounter();

    // Bước 1: Ống xăm rung lắc 3D & âm thanh
    const cylinder = document.getElementById('fortuneCylinder');
    if (cylinder) cylinder.classList.add('shaking');
    audio.playFortuneShake();

    updateCentralWorshipper(
      ev.user,
      ev.avatar,
      `🎋 Đang xin xăm...`,
      `${ev.user} đang thành tâm gieo quẻ...`,
      false
    );

    // Bước 2: Sau 550ms, Thẻ Tre 3D bắn ra từ ống xăm
    setTimeout(() => {
      if (cylinder) cylinder.classList.remove('shaking');

      const stick = document.getElementById('fortuneFlyingStick');
      const numEl = document.getElementById('flyingStickNum');
      if (stick && numEl) {
        numEl.textContent = `#${ev.fortune?.number || 1}`;
        stick.classList.remove('animating');
        void stick.offsetWidth; // Force reflow
        stick.classList.add('animating');
      }

      particles.spawnIncenseBurst(540, 680);

      // Bước 3: Sau 700ms thẻ tre bay ra, mở Sớ Hoàng Gia (Royal Oracle Scroll)
      setTimeout(() => {
        audio.playIncenseChime();
        showFortuneModal(ev.user, ev.avatar, ev.fortune, ev.topic);
        updateCentralWorshipper(
          ev.user,
          ev.avatar,
          `🎋 Quẻ số ${ev.fortune?.number} (${ev.fortune?.rank})`,
          ev.fortune?.meaning || '',
          true
        );

        if (ev.ttsText) {
          audio.enqueueTts(ev.ttsText, { voice: ev.ttsVoice || 'maichi' });
        }

        // Tự động điều chỉnh thời gian hiển thị: Nếu đông người chờ (>2 người), rút ngắn xuống 3.8s để giải phóng hàng đợi nhanh
        const displayDuration = fortuneQueue.length > 2 ? 3800 : (fortuneQueue.length > 0 ? 4600 : 6200);

        clearTimeout(fortuneTimer);
        fortuneTimer = setTimeout(() => {
          document.getElementById('fortuneModal')?.classList.remove('visible');
          // Nghỉ 400ms thanh thoát giữa 2 quẻ
          setTimeout(() => {
            processNextFortune();
          }, 450);
        }, displayDuration);

      }, 700);
    }, 550);
  }

  function showFortuneModal(user, avatar, fortune, topic) {
    if (!fortune) return;
    const modal = document.getElementById('fortuneModal');
    document.getElementById('fortuneRankBadge').textContent = (fortune.rank || 'CÁT').toUpperCase();
    document.getElementById('fortuneTitle').textContent = `Quẻ Số ${fortune.number} — ${fortune.title}`;
    document.getElementById('fortuneDevotee').textContent = `Thí chủ cầu quẻ: ${escapeHtml(user)}`;
    document.getElementById('fortuneTopicPill').textContent = `🎋 ${escapeHtml(topic || 'Cầu Vạn Sự Bình An & Cát Tường')}`;
    document.getElementById('fortunePoem').textContent = fortune.poem;
    document.getElementById('fortuneMeaning').textContent = `Lời bàn: ${fortune.meaning}`;

    const avatarEl = document.getElementById('fortuneDevoteeAvatar');
    if (avatarEl) {
      avatarEl.innerHTML = avatar
        ? `<img src="${escapeHtml(avatar)}" alt="" />`
        : escapeHtml(String(user || 'P').trim().charAt(0).toUpperCase());
    }

    modal.classList.add('visible');
  }

  document.getElementById('fortuneModal')?.addEventListener('click', () => {
    document.getElementById('fortuneModal').classList.remove('visible');
    clearTimeout(fortuneTimer);
    setTimeout(processNextFortune, 250);
  });

  function spawnSkyLantern(user, wish) {
    const layer = document.getElementById('skyLanternsLayer');
    if (!layer) return;
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';
    const leftPos = 80 + Math.floor(Math.random() * 640);
    lantern.style.left = `${leftPos}px`;
    lantern.innerHTML = `
      <div class="sky-lantern-user">🙏 ${escapeHtml(user)}</div>
      <div class="sky-lantern-wish">“${escapeHtml(wish)}”</div>
      <div class="lantern-tassel"></div>
    `;
    layer.appendChild(lantern);
    setTimeout(() => {
      lantern.remove();
    }, 11000);
  }

  function showGrandCeremonyBanner(user, giftName, merit) {
    const banner = document.getElementById('grandCeremonyBanner');
    document.getElementById('grandTitle').textContent = `🐉 ${giftName.toUpperCase()} 🐉`;
    document.getElementById('grandSub').textContent = `Đại Thí Chủ ${user} • Công Đức Vô Lượng (+${merit} CĐ)`;
    banner.classList.add('visible');
    clearTimeout(grandTimer);
    grandTimer = setTimeout(() => {
      banner.classList.remove('visible');
    }, 6800);
  }

  // 8. Kết nối JSON-RPC 2.0 WebSocket & Gửi Lệnh RPC
  let ws = null;
  let rpcId = 1;

  function connectWebSocket() {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${proto}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === 'temple.state') {
          updateUIState(msg.params);
          if (msg.params?.settings?.youtube) {
            audio.handleYouTubeControl(msg.params.settings.youtube);
          }
        } else if (msg.method === 'youtube.control') {
          audio.handleYouTubeControl(msg.params);
        } else if (msg.method === 'temple.scene') {
          if (msg.params?.scene) applyScene(msg.params.scene);
        } else if (msg.method === 'temple.event') {
          if (msg.params?.state) updateUIState(msg.params.state);
          if (msg.params?.event) triggerRitualVisuals(msg.params.event);
        } else if (msg.method === 'tts.play') {
          if (msg.params?.url) {
            audio.enqueueTts(msg.params.text || 'Nam mô A Di Đà Phật', {
              voice: msg.params.voice || 'maichi',
              url: msg.params.url
            });
          }
        }
      } catch (_) {}
    };

    ws.onclose = () => {
      setTimeout(connectWebSocket, 2000);
    };
  }
  connectWebSocket();

  async function callRpc(method, params = {}) {
    audio.ensureContext();
    const payload = {
      jsonrpc: '2.0',
      id: rpcId++,
      method,
      params
    };
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      return;
    }
    const res = await fetch('/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data?.result?.state) updateUIState(data.result.state);
    if (data?.result?.event) triggerRitualVisuals(data.result.event);
    return data;
  }

  function getFormInput() {
    const user = document.getElementById('inputDevoteeName')?.value.trim() || 'Quỳnh_Finn';
    const wish =
      document.getElementById('inputDevoteeWish')?.value.trim() ||
      'Cầu cho gia đình bình an, tài lộc hanh thông';
    return { user, wish };
  }

  // Gắn sự kiện tương tác trực tiếp trên màn hình 9:16 & Thanh HUD dưới đáy
  document.getElementById('incenseBurnerZone')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.burnIncense', { user, count: 3, wish });
  });

  document.getElementById('cardIncense')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.burnIncense', { user, count: 3, wish });
  });

  document.getElementById('cardBlessing')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.sendPrayer', { user, wish });
  });

  document.getElementById('cardLotus')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.offerGift', {
      user,
      giftType: 'lotus',
      coins: 20,
      giftName: 'Đài Hoa Sen Vàng',
      wish
    });
  });

  document.getElementById('woodenFishStation')?.addEventListener('click', () => {
    const { user } = getFormInput();
    triggerMonkStrike();
    callRpc('temple.strikeWoodenFish', { user, count: 1 });
  });

  document.getElementById('noviceMonkZone')?.addEventListener('click', () => {
    const { user } = getFormInput();
    triggerMonkStrike();
    callRpc('temple.strikeWoodenFish', { user, count: 1 });
  });

  document.getElementById('bellStation')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.ringBell', { user, count: 1, wish, readTts: true });
  });

  document.getElementById('fortuneCylinder')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.drawFortune', { user, topic: wish });
  });

  // Các nút trên Quick RPC Dock bên phải
  document.getElementById('btnRpcWelcome')?.addEventListener('click', () => {
    const { user } = getFormInput();
    callRpc('temple.welcomeDevotee', { user, message: `Hoan hỷ chào đón Thí Chủ ${user} đã vào Chánh Điện lễ Phật` });
  });

  document.getElementById('btnRpcIncense')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.burnIncense', { user, count: 3, wish });
  });

  document.getElementById('btnRpcLantern')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.sendPrayer', { user, wish });
  });

  document.getElementById('btnRpcWoodenFish')?.addEventListener('click', () => {
    const { user } = getFormInput();
    callRpc('temple.strikeWoodenFish', { user, count: 5 });
  });

  document.getElementById('btnRpcBell')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.ringBell', { user, count: 1, wish, readTts: true });
  });

  document.getElementById('btnRpcFortune')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.drawFortune', { user, topic: wish });
  });

  document.getElementById('btnRpcGiftLotus')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.offerGift', {
      user,
      giftType: 'lotus',
      coins: 20,
      giftName: 'Đài Hoa Sen Vàng',
      wish
    });
  });

  document.getElementById('btnRpcGrandCeremony')?.addEventListener('click', () => {
    const { user, wish } = getFormInput();
    callRpc('temple.grandCeremony', {
      user,
      coins: 299,
      giftName: 'Đại Lễ Kim Long Chầu Phật',
      wish
    });
  });

  document.getElementById('btnConnectTikTok')?.addEventListener('click', () => {
    const username = document.getElementById('inputTikTokUser')?.value.trim();
    if (!username) return;
    callRpc('live.connect', { username });
  });

  let autoSimState = false;
  document.getElementById('btnToggleAutoSim')?.addEventListener('click', () => {
    autoSimState = !autoSimState;
    callRpc('live.setAutoSim', { enabled: autoSimState });
  });

  document.getElementById('btnToggleTts')?.addEventListener('click', (e) => {
    audio.ttsEnabled = !audio.ttsEnabled;
    const btn = e.currentTarget;
    btn.textContent = `🎙️ Giọng Đọc: ${audio.ttsEnabled ? 'BẬT' : 'TẮT'}`;
    btn.classList.toggle('active-toggle', audio.ttsEnabled);
  });

  document.getElementById('btnToggleMusic')?.addEventListener('click', (e) => {
    audio.bgMusicEnabled = !audio.bgMusicEnabled;
    if (audio.bgMusicEnabled) {
      audio.startZenAmbience();
    } else {
      audio.stopZenAmbience();
    }
    const btn = e.currentTarget;
    btn.textContent = `🎵 Nhạc Nền: ${audio.bgMusicEnabled ? 'BẬT' : 'TẮT'}`;
    btn.classList.toggle('active-toggle', audio.bgMusicEnabled);
  });

  document.getElementById('btnToggleSafeMode')?.addEventListener('click', () => {
    const isCurrentlySafe = stage9x16.classList.contains('tiktok-safe-mode');
    callRpc('temple.updateSettings', { tiktokSafeMode: !isCurrentlySafe });
  });

  document.getElementById('btnToggleSafeGuide')?.addEventListener('click', () => {
    const guide = document.getElementById('tiktokSafeGuideOverlay');
    const isVisible = guide && guide.classList.contains('visible');
    callRpc('temple.updateSettings', { showSafeGuide: !isVisible });
  });

  // Lắng nghe lệnh từ Admin Dashboard qua postMessage (trong iframe preview)
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'setAudioMute') {
      audio.setMasterMute(event.data.muted);
    }
  });

  const btnToggleDock = document.getElementById('btnToggleQuickDock');
  const quickDock = document.getElementById('quickDock');
  if (btnToggleDock && quickDock) {
    btnToggleDock.addEventListener('click', () => {
      const isCollapsed = quickDock.classList.toggle('collapsed');
      btnToggleDock.innerHTML = isCollapsed ? '<span>🎛️ Mở Điều Khiển ▶</span>' : '<span>◀ Thu Gọn Điều Khiển</span>';
      fitStage();
    });
  }

  // Khởi tạo và gắn sự kiện thanh trượt chỉnh âm lượng Nhạc nền & Giọng đọc
  const sliderMusicVol = document.getElementById('sliderMusicVol');
  const valMusicVol = document.getElementById('valMusicVol');
  if (sliderMusicVol && valMusicVol) {
    const initMusPct = Math.round(audio.bgBaseVolume * 100);
    sliderMusicVol.value = String(initMusPct);
    valMusicVol.textContent = `${initMusPct}%`;
    sliderMusicVol.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      valMusicVol.textContent = `${pct}%`;
      audio.ensureContext();
      audio.setMusicVolume(pct / 100);
    });
    sliderMusicVol.addEventListener('change', (e) => {
      const pct = Number(e.target.value);
      callRpc('temple.updateSettings', { musicVolume: +(pct / 100).toFixed(2) });
    });
  }

  const sliderTtsVol = document.getElementById('sliderTtsVol');
  const valTtsVol = document.getElementById('valTtsVol');
  if (sliderTtsVol && valTtsVol) {
    const initTtsPct = Math.round(audio.ttsVolume * 100);
    sliderTtsVol.value = String(initTtsPct);
    valTtsVol.textContent = `${initTtsPct}%`;
    sliderTtsVol.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      valTtsVol.textContent = `${pct}%`;
      audio.setTtsVolume(pct / 100);
    });
    sliderTtsVol.addEventListener('change', (e) => {
      const pct = Number(e.target.value);
      callRpc('temple.updateSettings', { ttsVolume: +(pct / 100).toFixed(2) });
    });
  }

  function shortenName(name, maxLen = 13) {
    const str = String(name || '');
    return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
