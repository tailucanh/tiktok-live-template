/**
 * TEMPLE 3D SANCTUARY ENGINE (Three.js WebGL)
 * - Chibi NPC Tinh Tế & Đáng Yêu (Tỉ lệ 0.46 thanh nhã, áo Lam thanh tịnh, cổ áo trắng, tràng hạt bồ đề)
 * - Không che khay hương: Nhân vật quỳ trang nghiêm tại Z=1.45 trên thảm đỏ, cách xa Lư hương
 * - Loại bỏ khối hộp thô, giữ nguyên 100% bàn thờ Phật tôn nghiêm nguyên bản
 * - Bồ đoàn hoa sen thêu gấm đỏ & vàng hoàng gia (Procedural Lotus Cushions)
 * - Đạo diễn Camera Director & Ánh sáng 4 thời khắc
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  const CONFIG = {
    canvasWidth: 1080,
    canvasHeight: 1920,
    cameraFov: 42,
    cameraPos: new THREE.Vector3(0, 3.0, 7.0),
    cameraTarget: new THREE.Vector3(0, 1.2, 0.5),
    colors: {
      goldTrim: 0xf4c150,
      goldBright: 0xffe082,
      robeGrey: 0x64748b,      // Áo Lam thanh tịnh
      robeMaster: 0x475569,    // Áo Lam Chủ Lễ cao quý
      robeMonk: 0x713f12,      // Áo Nâu Sồng Chú Tiểu
      skinTone: 0xfff0e6,
      hairBlack: 0x18120e
    }
  };

  const CAM_PRESETS = {
    wide: { pos: new THREE.Vector3(0, 3.0, 7.0), target: new THREE.Vector3(0, 1.2, 0.5), fov: 42 },
    altar: { pos: new THREE.Vector3(0, 1.85, 3.2), target: new THREE.Vector3(0, 1.12, 0.40), fov: 44 },
    monk: { pos: new THREE.Vector3(0.40, 0.72, 2.20), target: new THREE.Vector3(0.95, 0.28, 0.88), fov: 36 },
    overhead: { pos: new THREE.Vector3(0, 6.2, 4.5), target: new THREE.Vector3(0, 0.4, 1.2), fov: 46 }
  };

  const AMBIENCES = {
    day: { ambient: 0xfffaed, ambInt: 1.3, key: 0xfff3d6, keyInt: 1.8, candle: 0xffa726, candleInt: 1.4 },
    sunset: { ambient: 0xffd5b0, ambInt: 1.1, key: 0xff9944, keyInt: 2.1, candle: 0xff7722, candleInt: 1.8 },
    night: { ambient: 0x1a243b, ambInt: 0.6, key: 0x6e8ec9, keyInt: 0.8, candle: 0xff9800, candleInt: 2.5 },
    golden: { ambient: 0xffe680, ambInt: 1.6, key: 0xffc400, keyInt: 2.4, candle: 0xffea00, candleInt: 2.0 }
  };


  // ===========================================================================
  // PALETTE MÀU CHÙA CỔ & PHẬT GIÁO VIỆT NAM (ĐỒNG BỘ TỪ ĐI CHÙA ONLINE)
  // ===========================================================================
  const PALETTE = {
    wood: new THREE.Color(0x5e301b),
    woodLight: new THREE.Color(0x8a4a2a),
    mouth: new THREE.Color(0x120806),
    stick: new THREE.Color(0x7a4426),
    felt: new THREE.Color(0xf1ead8),
    red: new THREE.Color(0xc8281c),
    yellow: new THREE.Color(0xe9b40c),
    brass: new THREE.Color(0xd8b25c),
    black: new THREE.Color(0x141414),
    porcelain: new THREE.Color(0xf2f1ec),
    cobalt: new THREE.Color(0x1f4f9a),
    leaf: new THREE.Color(0x3f7a34),
    leafLight: new THREE.Color(0x7aa85a),
    lotus: new THREE.Color(0xd96f96),
    lotusLight: new THREE.Color(0xf9bed2),
    bronze: new THREE.Color(0xa77c34),
    goldRelief: new THREE.Color(0xe6c26c),
    incense: new THREE.Color(0x8a2c1a),
    ember: new THREE.Color(0xff5511),
    silkRed: new THREE.Color(0x991b1b),
    ribRed: new THREE.Color(0x5a0a0a),
    lacquer: new THREE.Color(0x2a140a),
    tassel: new THREE.Color(0xb3862c),
    stone: new THREE.Color(0x8f8c85),
    goldStatue: new THREE.Color(0xe6b550)
  };


  // Tạo Texture Hoành Phi Đại Hùng Bảo Điện thếp vàng sắc nét
  function createHoanhPhiTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    // Nền sơn son gấm đỏ
    ctx.fillStyle = '#6b0f0f';
    ctx.fillRect(0, 0, 1024, 340);

    // Khung viền thếp vàng hoàng gia
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.strokeRect(16, 16, 992, 308);

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 960, 276);

    // Chữ Hán / Việt: 大 雄 寶 殿 (ĐẠI HÙNG BẢO ĐIỆN)
    ctx.fillStyle = '#fde047';
    ctx.font = '900 68px "Noto Serif", "Songti SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 12;
    ctx.fillText('大 雄 寶 殿', 512, 120);

    ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowBlur = 6;
    ctx.fillText('ĐẠI HÙNG BẢO ĐIỆN', 512, 215);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Tạo Texture Câu Đối đỏ thếp vàng
  function createCauDoiTexture(isLeft = true) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#5a0a0a';
    ctx.fillRect(0, 0, 256, 1024);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 236, 1004);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 38px "Noto Serif", serif';
    ctx.textAlign = 'center';

    const text = isLeft ? '佛 光 普 照' : '法 雨 均 沾';
    const subText = isLeft ? 'Phật Quang Phổ Chiếu' : 'Pháp Vũ Quân Triêm';
    
    const chars = text.split(' ');
    chars.forEach((c, idx) => {
      ctx.fillText(c, 128, 120 + idx * 110);
    });

    ctx.font = '600 20px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(subText, 128, 700);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function cushionCheckerPattern(pos, yMin, yMax, targetColor) {
    const angle = (Math.atan2(pos.z, pos.x) / (Math.PI * 2)) * 12;
    const h = ((pos.y - yMin) / (yMax - yMin)) * 2;
    const checker = (Math.floor(angle + h) + Math.floor(angle - h)) & 1;
    targetColor.copy(checker ? PALETTE.red : PALETTE.yellow);
  }

  function classifyBell(pos, norm, col) {
    if (Math.abs(pos.z) < 0.1 && pos.y > -0.2) {
      col.copy(PALETTE.black);
      return false;
    }
    if (pos.y < -0.29) {
      cushionCheckerPattern(pos, -0.72, -0.29, col);
      return false;
    }
    col.copy(PALETTE.brass);
    return true;
  }

  function classifyFish(pos, norm, col) {
    const { x, y, z } = pos;
    const thresh = 0.06 - 0.2 * (z + 0.35) - 0.015;
    if (Math.abs(x) > 0.48 && y > 0.08) {
      col.copy(x > 0.62 ? PALETTE.felt : PALETTE.stick);
      return false;
    }
    if (Math.abs(x) < 0.5 && y > thresh) {
      if (z > 0.3 && Math.abs(x) < 0.13 && y > -0.07 && y < 0) {
        col.copy(PALETTE.mouth);
      } else {
        const t = THREE.MathUtils.clamp(norm.y * 0.5 + 0.25, 0, 0.7);
        col.copy(PALETTE.wood).lerp(PALETTE.woodLight, t);
      }
      return false;
    }
    cushionCheckerPattern(pos, -0.66, 0, col);
    return false;
  }

  function classifyIncenseBurner(pos, norm, col) {
    const { x, y, z } = pos;
    const radius = Math.hypot(x, z);
    if (y > 0.12 && radius < 0.17) {
      col.copy(y > 0.86 ? PALETTE.ember : PALETTE.incense);
      return y > 0.86;
    }
    const factor = radius > 0.001 ? (norm.x * x + norm.z * z) / radius : 0;
    col.copy(PALETTE.bronze).lerp(PALETTE.goldRelief, THREE.MathUtils.clamp(factor * 0.8, 0, 0.8));
    return true;
  }

  function classifyLotusVase(pos, norm, col) {
    const { x, y, z } = pos;
    if (y < -0.25) {
      const radius = Math.hypot(x, z) || 1;
      const facing = (norm.x * x + norm.z * z) / radius;
      const isCobalt = y > -0.8 && y < -0.45 && facing < 0.8;
      col.copy((y > -0.33 || y < -0.86 || isCobalt) ? PALETTE.cobalt : PALETTE.porcelain);
    } else {
      if (y < 0.08 || (Math.abs(x) < 0.06 && Math.abs(z) < 0.06 && y < 0.5)) {
        col.copy(PALETTE.leaf).lerp(PALETTE.leafLight, THREE.MathUtils.clamp(norm.y * 0.5 + 0.3, 0, 1));
      } else {
        col.copy(PALETTE.lotus).lerp(PALETTE.lotusLight, THREE.MathUtils.clamp(norm.y * 0.5 + 0.35, 0, 0.85));
      }
    }
    return false;
  }

  function classifyLantern(pos, norm, col) {
    const { x, y, z } = pos;
    if (y < -0.31) col.copy(PALETTE.tassel);
    else if (y < -0.25) col.copy(PALETTE.black);
    else if (y < 0) col.copy(PALETTE.lacquer);
    else if (y > 0.125 && y < 0.875) {
      const angle = Math.atan2(x, z) / (Math.PI / 4);
      const isRib = Math.abs(angle - Math.round(angle)) * 45 <= 3.5;
      col.copy(isRib ? PALETTE.ribRed : PALETTE.silkRed);
      return isRib ? 'rib' : 'glow';
    } else col.copy(PALETTE.silkRed);
    return false;
  }

  function applyModelShading(root, classifier, materialProps = {}) {
    root.updateMatrixWorld(true);
    root.traverse((child) => {
      if (!child.isMesh || !child.geometry) return;
      const geo = child.geometry;
      const posAttr = geo.attributes.position;
      if (!posAttr) return;
      const normAttr = geo.attributes.normal || posAttr;
      const count = posAttr.count;
      const colors = new Float32Array(count * 3);
      const pos = new THREE.Vector3();
      const norm = new THREE.Vector3();
      const col = new THREE.Color();
      const normMatrix = new THREE.Matrix3().getNormalMatrix(child.matrixWorld);

      for (let i = 0; i < count; i++) {
        pos.fromBufferAttribute(posAttr, i).applyMatrix4(child.matrixWorld);
        norm.fromBufferAttribute(normAttr, i).applyMatrix3(normMatrix).normalize();
        if (classifier) {
          classifier(pos, norm, col);
        } else {
          col.copy(PALETTE.stone);
        }
        colors[i * 3 + 0] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      child.material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: materialProps.roughness ?? 0.42,
        metalness: materialProps.metalness ?? 0.20,
        ...materialProps
      });
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }

  function normalizeModel(model, targetHeight) {
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;

    const wrapper = new THREE.Group();
    wrapper.add(model);
    const scale = targetHeight / (size.y || 1);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }

  // 1. Tạo Texture Khuôn Mặt Chibi Hoan Hỷ & Xinh Xắn (512x512)
  function createChibiFaceTexture(isMonk = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Nền da hồng hào mịn màng với gradient
    const skinGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
    skinGrad.addColorStop(0, '#fff4ed');
    skinGrad.addColorStop(1, '#fed7aa');
    ctx.fillStyle = skinGrad;
    ctx.fillRect(0, 0, 512, 512);

    if (isMonk) {
      // 6 Chấm Giới Hương trên đỉnh đầu chú tiểu (Ordination dots)
      ctx.fillStyle = '#b45309';
      const dots = [
        [220, 75], [256, 75], [292, 75],
        [220, 105], [256, 105], [292, 105]
      ];
      dots.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // Chấm Tuệ Giác thanh nhã giữa trán
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(256, 195, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Đôi mắt Chibi khép hờ mỉm cười an lạc (Smiling Zen Eyes)
    ctx.strokeStyle = '#29180d';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';

    // Mắt trái
    ctx.beginPath();
    ctx.arc(170, 250, 44, Math.PI * 0.18, Math.PI * 0.82, false);
    ctx.stroke();

    // Mắt phải
    ctx.beginPath();
    ctx.arc(342, 250, 44, Math.PI * 0.18, Math.PI * 0.82, false);
    ctx.stroke();

    // Lông mi thanh tú
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(126, 262);
    ctx.lineTo(112, 250);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(386, 262);
    ctx.lineTo(400, 250);
    ctx.stroke();

    // Lông mày thanh tú
    ctx.strokeStyle = '#573017';
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.arc(170, 202, 46, Math.PI * 1.25, Math.PI * 1.75, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(342, 202, 46, Math.PI * 1.25, Math.PI * 1.75, false);
    ctx.stroke();

    // Đôi má hồng an lạc (Cute Blush)
    ctx.fillStyle = 'rgba(255, 110, 110, 0.45)';
    ctx.beginPath();
    ctx.ellipse(135, 305, 38, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(377, 305, 38, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vạch má hồng hoạt hình nhẹ
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 3.5;
    [-15, 0, 15].forEach((dx) => {
      ctx.beginPath();
      ctx.moveTo(135 + dx - 6, 298);
      ctx.lineTo(135 + dx + 6, 312);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(377 + dx - 6, 298);
      ctx.lineTo(377 + dx + 6, 312);
      ctx.stroke();
    });

    // Nụ cười từ bi hoan hỷ
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(256, 302, 32, Math.PI * 0.18, Math.PI * 0.82, false);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // 2. Tạo Texture Bồ Đoàn Thêu Hoa Sen Hoàng Gia (Lotus Embroidery Mat)
  function createLotusCushionTexture(isVip = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Nền gấm tròn
    const bgGrad = ctx.createRadialGradient(128, 128, 20, 128, 128, 126);
    if (isVip) {
      bgGrad.addColorStop(0, '#991b1b');
      bgGrad.addColorStop(0.85, '#5f1212');
      bgGrad.addColorStop(1, '#330808');
    } else {
      bgGrad.addColorStop(0, '#a16207');
      bgGrad.addColorStop(0.85, '#713f12');
      bgGrad.addColorStop(1, '#3b1c04');
    }
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();

    // Viền kim tuyến vàng thêu ngoài
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Hoa văn cánh hoa sen vàng 8 cánh ở trung tâm
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.save();
      ctx.translate(128, 128);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(24, 45, 0, 75);
      ctx.quadraticCurveTo(-24, 45, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Nhụy hoa sen trung tâm
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(128, 128, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // 3. Tạo Thẻ Tên 3D Nhỏ Gọn Lơ Lửng (3D Billboard Nametag)
  function createNameplateTexture(name, merit = 0, isVip = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    // Khung bo tròn tinh tế
    ctx.fillStyle = 'rgba(16, 5, 4, 0.90)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 368, 80, 40);
    ctx.fill();

    ctx.strokeStyle = isVip ? '#ffd700' : '#f4c150';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Icon hoa sen / chắp tay
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffe082';
    ctx.fillText('🙏', 26, 56);

    // Tên Thí Chủ
    ctx.font = 'bold 26px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#ffffff';
    let displayName = name || 'Thí Chủ';
    if (displayName.length > 11) displayName = displayName.substring(0, 10) + '…';
    ctx.fillText(displayName, 75, 45);

    // Điểm Công Đức
    ctx.font = '600 20px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#ffd54f';
    ctx.fillText(`+${merit || 15} Công Đức`, 75, 72);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  class Temple3DSystem {
    constructor() {
      this.container = null;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = new THREE.Clock();
      this.isInitialized = false;
      this.activeDevotees = new Map();
      this.freeSeats = [];
      this.allCushions = [];
      this.particles = { smoke: null, petals: null };
      this.noviceMonk = null;
      this.sharedFaceTex = null;
      this.sharedMonkFaceTex = null;

      this.currentCamPos = CONFIG.cameraPos.clone();
      this.targetCamPos = CONFIG.cameraPos.clone();
      this.currentCamLookAt = CONFIG.cameraTarget.clone();
      this.targetCamLookAt = CONFIG.cameraTarget.clone();
      this.activeCameraKey = 'wide';
      this.activeAmbienceKey = 'day';
    }

    init(containerEl) {
      if (this.isInitialized) return;
      this.container = containerEl || document.getElementById('temple3dContainer');
      if (!this.container) return;

      this.sharedFaceTex = createChibiFaceTexture(false);
      this.sharedMonkFaceTex = createChibiFaceTexture(true);

      // 1. Scene, Camera, Renderer
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(
        CONFIG.cameraFov,
        CONFIG.canvasWidth / CONFIG.canvasHeight,
        0.1,
        100
      );
      this.camera.position.copy(CONFIG.cameraPos);
      this.camera.lookAt(CONFIG.cameraTarget);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(CONFIG.canvasWidth, CONFIG.canvasHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.container.appendChild(this.renderer.domElement);
      this.renderer.domElement.className = 'temple-3d-canvas';

      // 2. Setup Lighting & Shadow Floor & Architecture
      this.setupLighting();
      this.buildShadowFloor();
      this.buildArchitecture();
      this.buildSeatGrid();
      this.buildNoviceMonk();
      this.setupParticles();
      this.fortuneCylinder = new FortuneCylinder3D(this.scene, new THREE.Vector3(1.10, 0, 1.25));
      this.switchStatue('buddha');

      // 3. Spawn Master Devotee (Chủ Lễ)
      this.spawnMasterDevotee();

      // 4. Render Loop 60 FPS
      this.isInitialized = true;
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);

      // 5. Khởi tạo góc nhìn Camera từ URL (?cam=monk / altar / overhead)
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const initCam = urlParams.get('cam');
        if (initCam && CAM_PRESETS[initCam]) {
          this.switchCamera(initCam, true);
        }
      } catch (e) {}

      console.log('🪷 [Temple3D Engine] Sảnh Điện Thờ 3D đã khởi động hoàn hảo 60 FPS');
    }

    setupLighting() {
      this.ambientLight = new THREE.AmbientLight(0xfffaed, 1.3);
      this.scene.add(this.ambientLight);

      this.keyLight = new THREE.DirectionalLight(0xfff3d6, 1.8);
      this.keyLight.position.set(0, 8.5, 1.5);
      this.keyLight.target.position.set(0, 0, 0);
      this.keyLight.castShadow = true;
      this.keyLight.shadow.mapSize.width = 1024;
      this.keyLight.shadow.mapSize.height = 1024;
      this.keyLight.shadow.bias = -0.001;
      this.scene.add(this.keyLight);
      this.scene.add(this.keyLight.target);

      this.candleWarmth = new THREE.PointLight(0xffa726, 1.4, 5.5, 1.5);
      this.candleWarmth.position.set(0, 1.6, 0.2);
      this.scene.add(this.candleWarmth);
    }

    loadGLTF(path, onLoad) {
      if (!this.gltfLoader && typeof THREE.GLTFLoader !== 'undefined') {
        this.gltfLoader = new THREE.GLTFLoader();
        if (typeof MeshoptDecoder !== 'undefined') {
          this.gltfLoader.setMeshoptDecoder(MeshoptDecoder);
        }
      }
      if (this.gltfLoader) {
        this.gltfLoader.load(
          path,
          (gltf) => onLoad(gltf.scene || gltf.scenes[0]),
          undefined,
          (err) => console.info('[GLTF Loader]', path, err?.message || err)
        );
      }
    }

    buildShadowFloor() {
      const floorGeo = new THREE.PlaneGeometry(16, 20);
      const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      floor.receiveShadow = true;
      this.scene.add(floor);
    }

    buildArchitecture() {
      // 1. Thảm Đỏ Dệt Hoa Sen Dọc Lối Đi Chính (Red Lotus Carpet)
      const carpetGeo = new THREE.PlaneGeometry(1.20, 6.5);
      const carpetMat = new THREE.MeshStandardMaterial({ color: 0x7a1818, roughness: 0.75 });
      const carpet = new THREE.Mesh(carpetGeo, carpetMat);
      carpet.rotation.x = -Math.PI / 2;
      carpet.position.set(0, 0.005, 2.5);
      carpet.receiveShadow = true;
      this.scene.add(carpet);

      // Viền vàng cho thảm
      const borderGeo = new THREE.PlaneGeometry(1.30, 6.5);
      const borderMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.rotation.x = -Math.PI / 2;
      border.position.set(0, 0.003, 2.5);
      this.scene.add(border);

      // 2. Hai Cột Gỗ Chùa Sơn Son Thếp Vàng (Lacquered Columns) - Căn chỉnh chuẩn góc 9:16
      const pillarGeo = new THREE.CylinderGeometry(0.18, 0.20, 9, 16);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x541810, roughness: 0.45 });
      const baseGeo = new THREE.CylinderGeometry(0.26, 0.30, 0.25, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.4 });

      [-1.38, 1.38].forEach((x) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(x, 4.5, 0.85);
        pillar.castShadow = true;
        this.scene.add(pillar);

        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.set(x, 0.12, 0.85);
        this.scene.add(base);
      });

      // 3. Hoành Phi "Đại Hùng Bảo Điện" thếp vàng sơn son sắc nét
      const hpTex = createHoanhPhiTexture();
      const hpGeo = new THREE.PlaneGeometry(1.80, 0.58);
      const hpMat = new THREE.MeshStandardMaterial({
        map: hpTex,
        roughness: 0.35,
        metalness: 0.30
      });
      const hpMesh = new THREE.Mesh(hpGeo, hpMat);
      hpMesh.position.set(0, 2.85, 0.45);
      this.scene.add(hpMesh);

      // 4. Câu Đối Hán Nôm dán trên 2 Cột Đình Chùa
      const cdLeftTex = createCauDoiTexture(true);
      const cdRightTex = createCauDoiTexture(false);
      const cdGeo = new THREE.PlaneGeometry(0.28, 2.3);
      
      const cdLeftMesh = new THREE.Mesh(cdGeo, new THREE.MeshStandardMaterial({ map: cdLeftTex, roughness: 0.4 }));
      cdLeftMesh.position.set(-1.35, 1.85, 0.95);
      this.scene.add(cdLeftMesh);

      const cdRightMesh = new THREE.Mesh(cdGeo, new THREE.MeshStandardMaterial({ map: cdRightTex, roughness: 0.4 }));
      cdRightMesh.position.set(1.35, 1.85, 0.95);
      this.scene.add(cdRightMesh);

      // 5. Nạp Lư Hương Đồng Chân Quỳ 3D (lu-huong.glb) với Shader Bronze Gold
      this.loadGLTF('/assets/models/lu-huong.glb', (model) => {
        applyModelShading(model, classifyIncenseBurner, { roughness: 0.38, metalness: 0.45 });
        const wrapper = normalizeModel(model, 0.52);
        wrapper.position.set(0, 0.0, 0.42);
        this.scene.add(wrapper);
      });

      // 6. Nạp 2 Bình Hoa Sen Cúng Phật 3D (binh-sen.glb) với Sứ Lam & Sen Hồng
      this.loadGLTF('/assets/models/binh-sen.glb', (model) => {
        applyModelShading(model, classifyLotusVase, { roughness: 0.32, metalness: 0.15 });
        [-0.82, 0.82].forEach((x) => {
          const clone = model.clone();
          const wrapper = normalizeModel(clone, 0.65);
          wrapper.position.set(x, 0.0, 0.55);
          this.scene.add(wrapper);
        });
      });

      // 7. Nạp 2 Đèn Lồng Hoa Đăng Cổ 3D (den-long.glb) treo trang nghiêm
      this.loadGLTF('/assets/models/den-long.glb', (model) => {
        applyModelShading(model, classifyLantern, { roughness: 0.45, metalness: 0.15 });
        [-1.15, 1.15].forEach((x) => {
          const clone = model.clone();
          const wrapper = normalizeModel(clone, 0.68);
          wrapper.position.set(x, 2.55, 0.85);
          this.scene.add(wrapper);
        });
      });

      // 8. Nạp Đại Hồng Chung Đồng 3D (chuong.glb) ở Cánh Tả (Bên Trái)
      this.loadGLTF('/assets/models/chuong.glb', (model) => {
        applyModelShading(model, classifyBell, { roughness: 0.35, metalness: 0.55 });
        const wrapper = normalizeModel(model, 0.70);
        wrapper.position.set(-1.15, 0.0, 1.45);
        this.bellMesh = wrapper;
        this.scene.add(wrapper);
      });

      // 9. Nạp 2 Tượng Hộ Pháp Tả / Hữu (ho-phap-trai.glb & ho-phap-phai.glb) Uy Nghi
      this.loadGLTF('/assets/models/ho-phap-trai.glb', (model) => {
        applyModelShading(model, null, { color: PALETTE.goldStatue, roughness: 0.35, metalness: 0.45 });
        const wrapper = normalizeModel(model, 1.35);
        wrapper.position.set(-1.42, 0.0, 0.82);
        wrapper.rotation.y = Math.PI * 0.32;
        this.scene.add(wrapper);
      });

      this.loadGLTF('/assets/models/ho-phap-phai.glb', (model) => {
        applyModelShading(model, null, { color: PALETTE.goldStatue, roughness: 0.35, metalness: 0.45 });
        const wrapper = normalizeModel(model, 1.35);
        wrapper.position.set(1.42, 0.0, 0.82);
        wrapper.rotation.y = -Math.PI * 0.32;
        this.scene.add(wrapper);
      });
    }

    buildSeatGrid() {
      this.allCushions = [];
      this.freeSeats = [];

      // Vị trí Chủ Lễ quỳ trang nghiêm trước bàn thờ (cách xa Lư Hương ở trên)
      this.centralPos = new THREE.Vector3(0, 0, 1.45);
      this.altarOfferingPos = new THREE.Vector3(0, 0, 0.35);

      const vipTex = createLotusCushionTexture(true);
      const hallTex = createLotusCushionTexture(false);

      const cushionGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.07, 18);
      const vipMat = new THREE.MeshStandardMaterial({
        map: vipTex,
        roughness: 0.55
      });
      const hallMat = new THREE.MeshStandardMaterial({
        map: hallTex,
        roughness: 0.6
      });

      // 1. Đệm Chủ Lễ (Master Devotee) ở giữa thảm đỏ
      const masterCushion = new THREE.Mesh(cushionGeo, vipMat);
      masterCushion.position.copy(this.centralPos);
      masterCushion.position.y = 0.035;
      masterCushion.receiveShadow = true;
      this.scene.add(masterCushion);

      // 2. 6 Đệm VIP Hàng Đầu (3 bên trái, 3 bên phải - không chắn thảm đỏ)
      const vipCoords = [
        { x: -1.05, z: 1.45 },
        { x: -1.50, z: 1.45 },
        { x: -1.95, z: 1.45 },
        { x: 1.05, z: 1.45 },
        { x: 1.50, z: 1.45 },
        { x: 1.95, z: 1.45 }
      ];
      vipCoords.forEach((coord, idx) => {
        const seat = { id: `vip_${idx + 1}`, isVip: true, pos: new THREE.Vector3(coord.x, 0, coord.z) };
        this.allCushions.push(seat);
        this.freeSeats.push(seat);

        const cushion = new THREE.Mesh(cushionGeo, vipMat);
        cushion.position.set(coord.x, 0.035, coord.z);
        cushion.receiveShadow = true;
        this.scene.add(cushion);
      });

      // 3. Đạo Tràng Phật Tử (Hai Cánh Gà)
      // 4 Hàng x 3 Cột mỗi bên, từ Z = 2.15 đến Z = 4.25
      const rows = 4;
      const leftX = [-1.05, -1.50, -1.95];
      const rightX = [1.05, 1.50, 1.95];

      for (let r = 0; r < rows; r++) {
        const z = 2.15 + r * 0.70;
        // Cánh Tả (Trái)
        leftX.forEach((x, c) => {
          const seat = { id: `hall_L_${r}_${c}`, isVip: false, pos: new THREE.Vector3(x, 0, z) };
          this.allCushions.push(seat);
          this.freeSeats.push(seat);

          const cushion = new THREE.Mesh(cushionGeo, hallMat);
          cushion.position.set(x, 0.035, z);
          cushion.receiveShadow = true;
          this.scene.add(cushion);
        });

        // Cánh Hữu (Phải)
        rightX.forEach((x, c) => {
          const seat = { id: `hall_R_${r}_${c}`, isVip: false, pos: new THREE.Vector3(x, 0, z) };
          this.allCushions.push(seat);
          this.freeSeats.push(seat);

          const cushion = new THREE.Mesh(cushionGeo, hallMat);
          cushion.position.set(x, 0.035, z);
          cushion.receiveShadow = true;
          this.scene.add(cushion);
        });
      }
    }

    buildNoviceMonk() {
      // Chú Tiểu ngồi an nhiên gõ mõ bên cánh phải
      this.noviceMonk = new NoviceMonk3D(this.scene, new THREE.Vector3(0.95, 0, 0.88), this.sharedMonkFaceTex);
    }


    switchStatue(statueKey) {
      const STATUES_CONFIG = {
        buddha: { name: 'Đức Bổn Sư Thích Ca Mâu Ni Phật', file: '/assets/models/buddha.glb', height: 2.10, y: 0.42, z: -0.65 },
        avalokiteshvara: { name: 'Đức Bồ Tát Quán Thế Âm Cứu Khổ', file: '/assets/models/avalokiteshvara.glb', height: 2.10, y: 0.42, z: -0.65 },
        ksitigarbha: { name: 'Đức Bồ Tát Địa Tạng Vương', file: '/assets/models/ksitigarbha.glb', height: 2.15, y: 0.42, z: -0.65 },
        'di-lac': { name: 'Đức Phật Di Lặc Hoan Hỷ Tự Tại', file: '/assets/models/di-lac.glb', height: 1.85, y: 0.42, z: -0.65 }
      };

      if (!STATUES_CONFIG[statueKey]) return;
      const cfg = STATUES_CONFIG[statueKey];
      this.activeStatueKey = statueKey;

      if (this.statueMesh) {
        this.scene.remove(this.statueMesh);
        this.statueMesh = null;
      }

      this.loadGLTF(cfg.file, (model) => {
        applyModelShading(model, null, {
          color: PALETTE.goldStatue,
          roughness: 0.28,
          metalness: 0.52
        });
        const wrapper = normalizeModel(model, cfg.height);
        wrapper.position.set(0, cfg.y, cfg.z);
        this.statueMesh = wrapper;
        this.scene.add(wrapper);
        console.log('🪷 Đã tôn trí Đại Tượng Phật 3D:', cfg.name);
      });
    }

    triggerMassProstrationWave() {
      let idx = 0;
      this.activeDevotees.forEach((dev) => {
        const delay = Math.abs(dev.pos.z) * 110 + idx * 45;
        setTimeout(() => {
          dev.triggerDeepProstration();
        }, delay);
        idx++;
      });
      if (this.noviceMonk) {
        setTimeout(() => this.noviceMonk.triggerStrike(), 200);
      }
    }

    handleOfferingIncense(username, wish) {
      let targetDevotee = this.activeDevotees.get(username);
      if (!targetDevotee) {
        targetDevotee = this.masterDevotee || Array.from(this.activeDevotees.values())[0];
      }
      if (targetDevotee) {
        targetDevotee.startAltarOfferingSequence(this.altarOfferingPos);
        if (wish) targetDevotee.speak(wish);

        // Cinematic Dolly Zoom sang góc cận bàn thờ
        const prevCam = this.activeCameraKey;
        this.switchCamera('altar');
        setTimeout(() => {
          this.switchCamera(prevCam);
        }, 4200);
      }
    }

    setupParticles() {
      // Khói nhang 3D bay lên từ bàn thờ
      const smokeCount = 75;
      const smokeGeo = new THREE.BufferGeometry();
      const smokePos = new Float32Array(smokeCount * 3);
      const smokeSpd = new Float32Array(smokeCount);

      for (let i = 0; i < smokeCount; i++) {
        smokePos[i * 3 + 0] = (Math.random() - 0.5) * 0.16;
        smokePos[i * 3 + 1] = 0.95 + Math.random() * 2.2;
        smokePos[i * 3 + 2] = -1.2 + (Math.random() - 0.5) * 0.16;
        smokeSpd[i] = 0.007 + Math.random() * 0.010;
      }
      smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
      this.particles.smoke = new THREE.Points(
        smokeGeo,
        new THREE.PointsMaterial({ color: 0xecd9c6, size: 0.13, transparent: true, opacity: 0.40, depthWrite: false })
      );
      this.particles.smokeSpd = smokeSpd;
      this.scene.add(this.particles.smoke);

      // Cánh hoa sen rơi 3D
      const petalCount = 65;
      const petalGeo = new THREE.BufferGeometry();
      const petalPos = new Float32Array(petalCount * 3);
      const petalSpd = new Float32Array(petalCount);

      for (let i = 0; i < petalCount; i++) {
        petalPos[i * 3 + 0] = (Math.random() - 0.5) * 5.5;
        petalPos[i * 3 + 1] = 0.3 + Math.random() * 5.0;
        petalPos[i * 3 + 2] = -1.5 + Math.random() * 7.0;
        petalSpd[i] = 0.009 + Math.random() * 0.014;
      }
      petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
      this.particles.petals = new THREE.Points(
        petalGeo,
        new THREE.PointsMaterial({ color: 0xff8da1, size: 0.09, transparent: true, opacity: 0.80, depthWrite: false })
      );
      this.particles.petalSpd = petalSpd;
      this.scene.add(this.particles.petals);
    }

    spawnMasterDevotee() {
      const master = new Devotee3D(this.scene, {
        name: 'Minh Tâm (Chủ Lễ)',
        merit: 35,
        isMaster: true,
        faceTexture: this.sharedFaceTex
      });
      master.teleportTo(this.centralPos);
      master.setState('IDLE_PRAY');
      this.masterDevotee = master;
      this.activeDevotees.set('__MASTER__', master);
    }

    handleViewerJoin(username, avatarUrl) {
      if (!username || this.activeDevotees.has(username)) return;

      const seat = this.freeSeats.shift();
      if (!seat) return;

      const dharma = typeof window.generateDharmaName === 'function' ? window.generateDharmaName(username) : username;
      const devotee = new Devotee3D(this.scene, {
        name: `${dharma} (${username})`,
        avatarUrl,
        merit: 15,
        assignedSeat: seat,
        isVip: seat.isVip,
        faceTexture: this.sharedFaceTex
      });

      devotee.startWalkToSeat(seat.pos);
      this.activeDevotees.set(username, devotee);
    }

    handleStrikeWoodenFish() {
      if (this.noviceMonk) this.noviceMonk.triggerStrike();
      this.activeDevotees.forEach((dev) => dev.triggerQuickBow());
    }

    handleRingBell() {
      this.activeDevotees.forEach((dev) => dev.triggerDeepProstration());
    }

    handleBurnIncense(username, count = 3, merit = 15) {
      let devotee = this.activeDevotees.get(username) || this.masterDevotee;
      if (!devotee) return;
      devotee.addMerit(merit);
      devotee.startAltarOfferingSequence(this.altarOfferingPos);
    }

    switchCamera(key, instant = false) {
      if (!CAM_PRESETS[key]) return;
      this.activeCameraKey = key;
      this.targetCamPos.copy(CAM_PRESETS[key].pos);
      this.targetCamLookAt.copy(CAM_PRESETS[key].target);
      document.body.setAttribute('data-cam', key);
      const stage = document.getElementById('stage9x16');
      if (stage) stage.setAttribute('data-cam', key);
      if (instant && this.camera) {
        this.currentCamPos.copy(CAM_PRESETS[key].pos);
        this.currentCamLookAt.copy(CAM_PRESETS[key].target);
        this.camera.position.copy(CAM_PRESETS[key].pos);
        this.camera.lookAt(CAM_PRESETS[key].target);
      }
    }

    switchAmbience(mode) {
      const amb = AMBIENCES[mode] || AMBIENCES.day;
      this.activeAmbienceKey = mode;
      if (this.ambientLight) {
        this.ambientLight.color.setHex(amb.ambient);
        this.ambientLight.intensity = amb.ambInt;
      }
      if (this.keyLight) {
        this.keyLight.color.setHex(amb.key);
        this.keyLight.intensity = amb.keyInt;
      }
      if (this.candleWarmth) {
        this.candleWarmth.color.setHex(amb.candle);
        this.candleWarmth.intensity = amb.candleInt;
      }
    }

    animate() {
      requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Camera Director: Smooth Lerp Position & LookAt
      if (this.targetCamPos && this.camera) {
        this.camera.position.lerp(this.targetCamPos, delta * 3.5);
      }
      if (this.currentCamLookAt && this.targetCamLookAt && this.camera) {
        this.currentCamLookAt.lerp(this.targetCamLookAt, delta * 3.5);
        this.camera.lookAt(this.currentCamLookAt);
      }

      // Nến lung linh
      if (this.candleWarmth) {
        this.candleWarmth.intensity = (AMBIENCES[this.activeAmbienceKey]?.candleInt || 1.4) + Math.sin(elapsed * 7.5) * 0.22;
      }

      // Khói nhang bay
      if (this.particles.smoke) {
        const pos = this.particles.smoke.geometry.attributes.position.array;
        for (let i = 0; i < pos.length / 3; i++) {
          pos[i * 3 + 1] += this.particles.smokeSpd[i];
          pos[i * 3 + 0] += Math.sin(elapsed * 2.0 + i) * 0.0014;
          if (pos[i * 3 + 1] > 3.6) {
            pos[i * 3 + 1] = 0.95;
            pos[i * 3 + 0] = (Math.random() - 0.5) * 0.16;
          }
        }
        this.particles.smoke.geometry.attributes.position.needsUpdate = true;
      }

      // Cánh hoa sen rơi
      if (this.particles.petals) {
        const pos = this.particles.petals.geometry.attributes.position.array;
        for (let i = 0; i < pos.length / 3; i++) {
          pos[i * 3 + 1] -= this.particles.petalSpd[i];
          pos[i * 3 + 0] += Math.sin(elapsed * 1.5 + i) * 0.004;
          if (pos[i * 3 + 1] < 0.1) {
            pos[i * 3 + 1] = 5.0;
            pos[i * 3 + 0] = (Math.random() - 0.5) * 5.5;
          }
        }
        this.particles.petals.geometry.attributes.position.needsUpdate = true;
      }

      // Cập nhật hoạt cảnh NPC an toàn tuyệt đối
      try {
        if (this.noviceMonk) this.noviceMonk.update(delta, elapsed);
        if (this.fortuneCylinder) this.fortuneCylinder.update(delta, elapsed);
        this.activeDevotees.forEach((dev) => dev.update(delta, elapsed));
      } catch (err) {
        console.warn('[Temple3D Update]', err);
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  // ===========================================================================
  // LỚP NHÂN VẬT PHẬT TỬ 3D CHIBI (VỚI DIỆN MẠO HOAN HỶ & THẺ TÊN LƠ LỬNG)
  // ===========================================================================
  class Devotee3D {
    constructor(scene, opts = {}) {
      this.scene = scene;
      this.name = opts.name || 'Thí Chủ';
      this.merit = opts.merit || 15;
      this.isMaster = !!opts.isMaster;
      this.isVip = !!opts.isVip;
      this.faceTexture = opts.faceTexture;
      this.pos = (opts.assignedSeat && opts.assignedSeat.pos) ? opts.assignedSeat.pos.clone() : (opts.pos ? opts.pos.clone() : new THREE.Vector3(0, 0, 1.45));
      this.state = 'IDLE_PRAY';
      this.walkSpeed = 1.4;
      this.waypoints = [];
      this.currentWpIndex = 0;
      this.prostrationPhase = 0;
      this.prostrationTimer = 0;
      this.buildMesh();
    }

    buildMesh() {
      this.group = new THREE.Group();
      this.group.position.copy(this.pos);
      this.group.rotation.y = -Math.PI / 1.6;
      this.group.scale.set(0.46, 0.46, 0.46);

      // 1. Bồ đoàn thiền tọa thêu gấm sen nâu viền vàng
      const cushionGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.08, 20);
      const cushionMat = new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.65 });
      const seat = new THREE.Mesh(cushionGeo, cushionMat);
      seat.position.y = 0.04;
      seat.receiveShadow = true;
      this.group.add(seat);

      const rimGeo = new THREE.TorusGeometry(0.30, 0.02, 8, 24);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.4 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.06;
      this.group.add(rim);

      const robeMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.68 });
      const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: this.faceTex,
        roughness: 0.42
      });

      // 2. Tọa thiền: vạt áo xếp bằng đài sen
      const lapGeo = new THREE.CylinderGeometry(0.24, 0.36, 0.22, 18);
      const lap = new THREE.Mesh(lapGeo, robeMat);
      lap.position.y = 0.15;
      lap.receiveShadow = true;
      lap.castShadow = true;
      this.group.add(lap);

      // Thân trên áo nâu sồng
      const torsoGeo = new THREE.CylinderGeometry(0.18, 0.23, 0.38, 16);
      this.body = new THREE.Mesh(torsoGeo, robeMat);
      this.torso = this.body;
      this.body.position.y = 0.42;
      this.body.castShadow = true;
      this.group.add(this.body);

      // Cổ áo trắng thanh tịnh (White Zen Inner Collar)
      const collarGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.08, 16);
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.y = 0.20;
      this.body.add(collar);

      // 3. Đầu tròn Chibi hoan hỷ (Mặt mỉm cười an lạc hướng về camera)
      const headGeo = new THREE.SphereGeometry(0.23, 24, 24);
      this.head = new THREE.Mesh(headGeo, skinMat);
      this.head.position.y = 0.36;
      this.head.rotation.y = 0.35; // Hướng mặt tươi vui về phía người xem
      this.head.castShadow = true;
      this.body.add(this.head);

      // 4. Tay trái lần tràng hạt bồ đề trên gối
      const armGeo = new THREE.CylinderGeometry(0.048, 0.042, 0.30, 10);
      const leftArm = new THREE.Mesh(armGeo, robeMat);
      leftArm.position.set(-0.20, 0.14, 0.08);
      leftArm.rotation.set(0.75, 0, -0.35);
      this.body.add(leftArm);

      // Chuỗi tràng hạt bồ đề nâu trên cổ tay trái
      const beadsGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 16);
      const beadsMat = new THREE.MeshStandardMaterial({ color: 0x3d1c06, roughness: 0.3 });
      const beads = new THREE.Mesh(beadsGeo, beadsMat);
      beads.position.set(0, -0.14, 0);
      beads.rotation.x = Math.PI / 2;
      leftArm.add(beads);

      // 5. Tay phải cầm dùi gõ mõ nhịp nhàng
      this.rightArm = new THREE.Mesh(armGeo, robeMat);
      this.rightArm.position.set(0.20, 0.16, 0.08);
      this.rightArm.rotation.x = 0.6;
      this.body.add(this.rightArm);

      // Dùi gõ mõ gỗ sơn son
      const malletGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.28, 8);
      const malletMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
      const mallet = new THREE.Mesh(malletGeo, malletMat);
      mallet.position.set(0, -0.15, 0.10);
      mallet.rotation.x = Math.PI / 3;
      this.rightArm.add(mallet);

      // Đầu dùi tròn gõ mõ
      const malletTipGeo = new THREE.SphereGeometry(0.026, 12, 12);
      const malletTip = new THREE.Mesh(malletTipGeo, malletMat);
      malletTip.position.set(0, 0.14, 0);
      mallet.add(malletTip);

      // 6. Mõ Gỗ Tròn 3D đặt trang nghiêm trên đệm con trước mặt Chú Tiểu
      const fishCushionGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.04, 16);
      const fishSeat = new THREE.Mesh(fishCushionGeo, cushionMat);
      fishSeat.position.set(-0.06, 0.02, 0.34);
      this.group.add(fishSeat);

      const fishGeo = new THREE.SphereGeometry(0.16, 18, 16);
      fishGeo.scale(1.0, 0.75, 1.05);
      const fishMat = new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.35 });
      const woodFish = new THREE.Mesh(fishGeo, fishMat);
      woodFish.position.set(-0.06, 0.10, 0.34);
      woodFish.castShadow = true;
      this.group.add(woodFish);

      this.scene.add(this.group);
    }

    teleportTo(pos) {
      this.group.position.copy(pos);
      this.group.rotation.y = Math.PI;
    }

    setState(st) {
      this.state = st;
    }

    addMerit(amount) {
      this.merit += amount;
      if (this.nameplate) {
        this.nameplate.material.map = createNameplateTexture(this.name, this.merit, this.isVip);
        this.nameplate.material.map.needsUpdate = true;
      }
    }

    startWalkToSeat(seatPos) {
      this.group.position.set(0, 0, 5.2);
      this.waypoints = [new THREE.Vector3(0, 0, seatPos.z), seatPos.clone()];
      this.currentWpIndex = 0;
      this.state = 'WALK_TO_SEAT';
    }

    startAltarOfferingSequence(altarPos) {
      if (this.state === 'WALK_TO_ALTAR' || this.state === 'OFFER_INCENSE') return;
      this.returnSeatPos = this.group.position.clone();
      this.waypoints = [new THREE.Vector3(0, 0, this.group.position.z), altarPos.clone()];
      this.currentWpIndex = 0;
      this.state = 'WALK_TO_ALTAR';
    }

    triggerQuickBow() {
      if (this.state !== 'IDLE_PRAY') return;
      this.prostrationPhase = 1;
      this.prostrationTimer = 0;
    }

    triggerDeepProstration() {
      this.prostrationPhase = 1;
      this.prostrationTimer = 0;
    }

    speak(message) {
      if (!message) return;
      if (this.speechSprite) {
        this.group.remove(this.speechSprite);
        this.speechSprite = null;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');

      // Khung thoại tròn sơn mài đen viền vàng hoàng kim
      ctx.fillStyle = 'rgba(20, 8, 6, 0.94)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 492, 120, 24);
      ctx.fill();

      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Tam giác đuôi bong bóng thoại
      ctx.fillStyle = 'rgba(20, 8, 6, 0.94)';
      ctx.beginPath();
      ctx.moveTo(240, 130);
      ctx.lineTo(256, 140);
      ctx.lineTo(272, 130);
      ctx.fill();

      // Icon & Tên Thí Chủ
      ctx.font = 'bold 24px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText(`💬 ${this.name}:`, 24, 46);

      // Nội dung lời khấn
      ctx.font = '600 26px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#ffffff';
      let displayText = message;
      if (displayText.length > 24) displayText = displayText.substring(0, 23) + '…';
      ctx.fillText(displayText, 24, 94);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      this.speechSprite = new THREE.Sprite(mat);
      this.speechSprite.scale.set(0.95, 0.26, 1.0);
      this.speechSprite.position.set(0, 0.85, 0);
      this.group.add(this.speechSprite);

      this.speechTimer = 4.2;
    }

    update(delta, elapsed) {
      if (this.nameplate) {
        this.nameplate.rotation.y = -this.group.rotation.y;
      }

      if (this.state === 'IDLE_PRAY') {
        const breath = Math.sin(elapsed * 2.2 + this.group.position.x * 2.5);
        this.torso.position.y = 0.44 + breath * 0.012;
        this.head.rotation.z = breath * 0.04;

        if (this.prostrationPhase > 0) {
          this.prostrationTimer += delta;
          if (this.prostrationPhase === 1) {
            this.torso.rotation.x = THREE.MathUtils.lerp(this.torso.rotation.x, 0.75, delta * 5.0);
            this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0.45, delta * 5.0);
            if (this.prostrationTimer > 0.65) this.prostrationPhase = 2;
          } else if (this.prostrationPhase === 2) {
            this.torso.rotation.x = THREE.MathUtils.lerp(this.torso.rotation.x, 0, delta * 4.5);
            this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0, delta * 4.5);
            if (this.torso.rotation.x < 0.05) {
              this.torso.rotation.x = 0;
              this.prostrationPhase = 0;
            }
          }
        }
      } else if (this.state.startsWith('WALK')) {
        if (this.waypoints.length === 0) return;
        const target = this.waypoints[this.currentWpIndex];
        const dir = target.clone().sub(this.group.position);
        dir.y = 0;
        const dist = dir.length();

        if (dist > 0.05) {
          const targetAng = Math.atan2(dir.x, dir.z);
          this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, targetAng, delta * 8.0);
        }

        const step = this.walkSpeed * delta;
        if (dist <= step) {
          this.group.position.copy(target);
          this.currentWpIndex++;
          if (this.currentWpIndex >= this.waypoints.length) {
            if (this.state === 'WALK_TO_SEAT' || this.state === 'WALK_BACK') {
              this.group.rotation.y = Math.PI;
              this.state = 'IDLE_PRAY';
            } else if (this.state === 'WALK_TO_ALTAR') {
              this.group.rotation.y = Math.PI;
              this.state = 'OFFER_INCENSE';
              this.offeringTimer = 0;
            }
          }
        } else {
          dir.normalize();
          this.group.position.addScaledVector(dir, step);
          const walkCycle = Math.sin(elapsed * 9.5);
          if (this.leftLeg) this.leftLeg.rotation.x = walkCycle * 0.42;
          if (this.rightLeg) this.rightLeg.rotation.x = -walkCycle * 0.42;
          if (this.hips) this.hips.position.y = 0.24 + Math.abs(Math.cos(elapsed * 9.5)) * 0.04;
        }
      } else if (this.state === 'OFFER_INCENSE') {
        this.offeringTimer = (this.offeringTimer || 0) + delta;
        const bow = Math.sin(this.offeringTimer * 3.2);
        if (bow > 0) {
          this.torso.rotation.x = bow * 0.85;
          this.head.rotation.z = bow * 0.45;
        } else {
          this.torso.rotation.x = 0;
          this.head.rotation.z = 0;
        }

        if (this.offeringTimer > 3.8) {
          this.waypoints = [
            new THREE.Vector3(0, 0, this.returnSeatPos ? this.returnSeatPos.z : 1.45),
            this.returnSeatPos ? this.returnSeatPos.clone() : (this.centralPos ? this.centralPos.clone() : new THREE.Vector3(0, 0, 1.45))
          ];
          this.currentWpIndex = 0;
          this.state = 'WALK_BACK';
        }
      }
    }
  }

  // ===========================================================================
  // LỚP NHÂN VẬT CHÚ TIỂU 3D (CHIBI NOVICE MONK)
  // ===========================================================================
  class NoviceMonk3D {
    constructor(scene, pos, faceTex) {
      this.scene = scene;
      this.pos = pos;
      this.faceTex = faceTex;
      this.strikeAnim = 0;
      this.buildMesh();
    }

    buildMesh() {
      this.group = new THREE.Group();
      this.group.position.copy(this.pos);
      this.group.rotation.y = -Math.PI / 1.6;
      this.group.scale.set(0.44, 0.44, 0.44);

      // 1. Bồ đoàn thiền tọa thêu gấm sen nâu viền vàng hoàng gia
      const cushionGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.08, 20);
      const cushionMat = new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.65 });
      const seat = new THREE.Mesh(cushionGeo, cushionMat);
      seat.position.y = 0.04;
      seat.receiveShadow = true;
      this.group.add(seat);

      const rimGeo = new THREE.TorusGeometry(0.30, 0.02, 8, 24);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.4 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.06;
      this.group.add(rim);

      const robeMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.68 });
      const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: this.faceTex,
        roughness: 0.42
      });

      // 2. Chân xếp bằng thiền tọa (Crossed legs sitting base)
      const lapGeo = new THREE.CylinderGeometry(0.24, 0.35, 0.20, 18);
      const lap = new THREE.Mesh(lapGeo, robeMat);
      lap.position.y = 0.14;
      lap.receiveShadow = true;
      lap.castShadow = true;
      this.group.add(lap);

      // Thân trên áo nâu sồng
      const torsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.34, 16);
      this.body = new THREE.Mesh(torsoGeo, robeMat);
      this.body.position.y = 0.38;
      this.body.castShadow = true;
      this.group.add(this.body);

      // Cổ áo trắng thanh tịnh (White Zen Inner Collar)
      const collarGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.08, 16);
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.y = 0.18;
      this.body.add(collar);

      // 3. Đầu tròn Chibi hoan hỷ (Mặt mỉm cười an lạc hướng về camera)
      const headGeo = new THREE.SphereGeometry(0.23, 24, 24);
      this.head = new THREE.Mesh(headGeo, skinMat);
      this.head.position.y = 0.33;
      this.head.rotation.y = 0.35; // Hướng mặt tươi vui về phía người xem
      this.head.castShadow = true;
      this.body.add(this.head);

      // 4. Tay trái lần tràng hạt bồ đề trên gối
      const armGeo = new THREE.CylinderGeometry(0.046, 0.040, 0.28, 10);
      const leftArm = new THREE.Mesh(armGeo, robeMat);
      leftArm.position.set(-0.19, 0.12, 0.08);
      leftArm.rotation.set(0.75, 0, -0.35);
      this.body.add(leftArm);

      // Chuỗi tràng hạt bồ đề nâu trên cổ tay trái
      const beadsGeo = new THREE.TorusGeometry(0.045, 0.013, 8, 16);
      const beadsMat = new THREE.MeshStandardMaterial({ color: 0x3d1c06, roughness: 0.3 });
      const beads = new THREE.Mesh(beadsGeo, beadsMat);
      beads.position.set(0, -0.12, 0);
      beads.rotation.x = Math.PI / 2;
      leftArm.add(beads);

      // 5. Tay phải cầm dùi gõ mõ nhịp nhàng
      this.rightArm = new THREE.Mesh(armGeo, robeMat);
      this.rightArm.position.set(0.19, 0.14, 0.08);
      this.rightArm.rotation.x = 0.6;
      this.body.add(this.rightArm);

      // Dùi gõ mõ gỗ sơn son
      const malletGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.26, 8);
      const malletMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
      const mallet = new THREE.Mesh(malletGeo, malletMat);
      mallet.position.set(0, -0.14, 0.09);
      mallet.rotation.x = Math.PI / 3;
      this.rightArm.add(mallet);

      // Đầu dùi tròn gõ mõ
      const malletTipGeo = new THREE.SphereGeometry(0.024, 12, 12);
      const malletTip = new THREE.Mesh(malletTipGeo, malletMat);
      malletTip.position.set(0, 0.13, 0);
      mallet.add(malletTip);

      // 6. Mõ Gia Trì 3D (mo.glb) chạm trổ vảy rồng đặt trên đệm con trước mặt Chú Tiểu
      const fishCushionGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.04, 16);
      const fishSeat = new THREE.Mesh(fishCushionGeo, cushionMat);
      fishSeat.position.set(-0.06, 0.02, 0.32);
      this.group.add(fishSeat);

      if (typeof window.Temple3D !== 'undefined' && window.Temple3D.loadGLTF) {
        window.Temple3D.loadGLTF('/assets/models/mo.glb', (model) => {
          applyModelShading(model, classifyFish, { roughness: 0.38, metalness: 0.18 });
          const wrapper = normalizeModel(model, 0.22);
          wrapper.position.set(-0.06, 0.04, 0.32);
          wrapper.rotation.y = -Math.PI / 4;
          this.woodFish = wrapper;
          this.group.add(wrapper);
        });
      } else {
        const fishGeo = new THREE.SphereGeometry(0.15, 18, 16);
        fishGeo.scale(1.0, 0.75, 1.05);
        const woodFish = new THREE.Mesh(fishGeo, new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.35 }));
        woodFish.position.set(-0.06, 0.09, 0.32);
        this.group.add(woodFish);
      }

      this.scene.add(this.group);
    }

    triggerStrike() {
      this.strikeAnim = 1.0;
    }

    update(delta, elapsed) {
      const breath = Math.sin(elapsed * 2.5);
      this.head.rotation.z = breath * 0.03;

      if (this.strikeAnim > 0) {
        this.strikeAnim -= delta * 6.5;
        if (this.strikeAnim < 0) this.strikeAnim = 0;
        this.rightArm.rotation.x = 0.5 + Math.sin(this.strikeAnim * Math.PI) * 0.65;
      }
    }
  }

  window.Temple3D = new Temple3DSystem();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('temple3dContainer');
      if (el) window.Temple3D.init(el);
    });
  } else {
    const el = document.getElementById('temple3dContainer');
    if (el) window.Temple3D.init(el);
  }
})();


  // ===========================================================================
  // LỚP ỐNG XĂM TRE 3D (3D BAMBOO FORTUNE ORACLE CYLINDER)
  // ===========================================================================
  class FortuneCylinder3D {
    constructor(scene, pos) {
      this.scene = scene;
      this.pos = pos;
      this.isShaking = false;
      this.shakeTimer = 0;
      this.buildMesh();
    }

    buildMesh() {
      this.group = new THREE.Group();
      this.group.position.copy(this.pos);

      // Đôn gỗ kê ống xăm
      const standGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.10, 16);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x541810, roughness: 0.5 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = 0.05;
      stand.receiveShadow = true;
      this.group.add(stand);

      // Ống xăm bằng tre già mộc mạc
      const tubeGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.36, 18);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.45, metalness: 0.1 });
      this.tube = new THREE.Mesh(tubeGeo, tubeMat);
      this.tube.position.y = 0.26;
      this.tube.castShadow = true;
      this.group.add(this.tube);

      // Đai kim loại vàng bọc miệng và đáy ống xăm
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.5 });
      const topRimGeo = new THREE.TorusGeometry(0.092, 0.008, 8, 20);
      const topRim = new THREE.Mesh(topRimGeo, rimMat);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.y = 0.18;
      this.tube.add(topRim);

      // 24 Thẻ xăm nan tre tỏa đều bên trong miệng ống
      const stickGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.42, 6);
      const stickMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
      for (let i = 0; i < 24; i++) {
        const stick = new THREE.Mesh(stickGeo, stickMat);
        const ang = (i / 24) * Math.PI * 2;
        const rad = 0.025 + (i % 3) * 0.015;
        stick.position.set(Math.cos(ang) * rad, 0.10 + (i % 4) * 0.015, Math.sin(ang) * rad);
        stick.rotation.set((Math.random() - 0.5) * 0.15, 0, (Math.random() - 0.5) * 0.15);
        this.tube.add(stick);
      }

      // Thẻ xăm Thần Triện phát sáng sẽ vọt lên khi bốc quẻ
      const activeStickGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.46, 8);
      const activeStickMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.25,
        metalness: 0.6,
        emissive: 0xca8a04,
        emissiveIntensity: 0.6
      });
      this.activeStick = new THREE.Mesh(activeStickGeo, activeStickMat);
      this.activeStick.position.set(0, 0.12, 0);
      this.tube.add(this.activeStick);

      this.scene.add(this.group);
    }

    triggerShake(onComplete) {
      if (this.isShaking) return;
      this.isShaking = true;
      this.shakeTimer = 1.4;
      this.onComplete = onComplete;
    }

    update(delta, elapsed) {
      if (this.isShaking) {
        this.shakeTimer -= delta;
        const progress = (1.4 - this.shakeTimer) / 1.4;
        
        // Lắc nghiêng ống tre theo nhịp
        this.tube.rotation.z = Math.sin(progress * 28.0) * 0.22;
        this.tube.rotation.x = Math.cos(progress * 22.0) * 0.15;

        // Thẻ xăm vàng vọt lên cao phát quang
        if (progress > 0.4) {
          const stickRise = Math.sin((progress - 0.4) / 0.6 * Math.PI) * 0.38;
          this.activeStick.position.y = 0.12 + stickRise;
          this.activeStick.rotation.y = elapsed * 12.0;
        }

        if (this.shakeTimer <= 0) {
          this.isShaking = false;
          this.tube.rotation.set(0, 0, 0);
          this.activeStick.position.set(0, 0.12, 0);
          if (this.onComplete) this.onComplete();
        }
      }
    }
  }
