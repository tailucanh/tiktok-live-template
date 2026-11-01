/**
 * TEMPLE 3D SANCTUARY ENGINE (Three.js WebGL)
 * Hòa quyện Chánh Điện Tôn Nghiêm 100% với Nhân Vật & Chuyển Động 3D Realtime
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  const CONFIG = {
    canvasWidth: 1080,
    canvasHeight: 1920,
    cameraFov: 42,
    cameraPos: new THREE.Vector3(0, 3.2, 7.2),
    cameraTarget: new THREE.Vector3(0, 1.4, -0.8),
    colors: {
      goldTrim: 0xf4c150,
      goldBright: 0xffe082,
      robeGrey: 0x5a6c7e,      // Áo Lam Phật tử truyền thống
      robeMaster: 0x4a5d70,    // Áo Lam Chủ Lễ trang trọng
      robeMonk: 0x5c3317,      // Áo Nâu Sồng Chú Tiểu
      skinTone: 0xffe2c4,      // Màu da hồng hào tự nhiên
      hairBlack: 0x1a1512
    }
  };

  // Tạo Texture Khuôn Mặt Chibi Hoan Hỷ (Serene Smiling Face)
  function createChibiFaceTexture(isMonk = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Nền da hồng hào
    ctx.fillStyle = '#ffe2c4';
    ctx.fillRect(0, 0, 256, 256);

    // Đôi mắt khép hờ tĩnh tâm / mỉm cười (Smiling Zen Eyes)
    ctx.strokeStyle = '#3a2416';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Mắt trái
    ctx.beginPath();
    ctx.arc(88, 120, 22, Math.PI * 0.15, Math.PI * 0.85, false);
    ctx.stroke();

    // Mắt phải
    ctx.beginPath();
    ctx.arc(168, 120, 22, Math.PI * 0.15, Math.PI * 0.85, false);
    ctx.stroke();

    // Đôi má hồng an lạc (Blush)
    ctx.fillStyle = 'rgba(255, 140, 140, 0.42)';
    ctx.beginPath();
    ctx.arc(68, 145, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(188, 145, 18, 0, Math.PI * 2);
    ctx.fill();

    // Nụ cười từ bi nhẹ nhàng
    ctx.strokeStyle = '#4a2618';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(128, 148, 16, Math.PI * 0.2, Math.PI * 0.8, false);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Tạo Thẻ Tên 3D Lơ Lửng (3D Billboard Nametag)
  function createNameplateTexture(name, merit = 0, isVip = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    // Khung bo tròn kiểu Game Tâm Linh
    ctx.fillStyle = 'rgba(16, 5, 4, 0.88)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 368, 80, 40);
    ctx.fill();

    ctx.strokeStyle = isVip ? '#ffd700' : '#f4c150';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Icon hoa sen / chắp tay
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffe082';
    ctx.fillText('🙏', 28, 56);

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

      // 2. Setup Lighting & Shadow Floor
      this.setupLighting();
      this.buildShadowFloor();
      this.buildSeatGrid();
      this.buildNoviceMonk();
      this.setupParticles();

      // 3. Spawn Master Devotee (Chủ Lễ)
      this.spawnMasterDevotee();

      // 4. Render Loop 60 FPS
      this.isInitialized = true;
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);

      console.log('🪷 [Temple3D Engine] Sảnh Điện Thờ 3D đã khởi động hoàn hảo 60 FPS');
    }

    setupLighting() {
      const ambient = new THREE.AmbientLight(0xfffaed, 1.3);
      this.scene.add(ambient);

      // Nguồn sáng chính đổ bóng mềm
      const keyLight = new THREE.DirectionalLight(0xfff3d6, 1.8);
      keyLight.position.set(0, 8.5, 1.5);
      keyLight.target.position.set(0, 0, 0);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.001;
      this.scene.add(keyLight);
      this.scene.add(keyLight.target);

      this.candleWarmth = new THREE.PointLight(0xffa726, 1.4, 5.5, 1.5);
      this.candleWarmth.position.set(0, 1.6, -1.8);
      this.scene.add(this.candleWarmth);
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

    buildSeatGrid() {
      this.allCushions = [];
      this.freeSeats = [];

      this.centralPos = new THREE.Vector3(0, 0, -0.65);
      this.altarOfferingPos = new THREE.Vector3(0, 0, -1.85);

      // 6 Đệm VIP Hàng Đầu (Z = -0.45)
      const vipX = [-1.45, -0.95, -0.45, 0.45, 0.95, 1.45];
      vipX.forEach((x, idx) => {
        const seat = { id: `vip_${idx + 1}`, isVip: true, pos: new THREE.Vector3(x, 0, -0.45) };
        this.allCushions.push(seat);
        this.freeSeats.push(seat);
      });

      // 40 Đệm Đạo Tràng (5 Hàng x 4 Cột)
      const rows = 5;
      const cols = 4;
      for (let r = 0; r < rows; r++) {
        const z = 0.35 + r * 0.72;
        // Cánh tả (trái)
        for (let c = 0; c < cols; c++) {
          const x = -0.65 - c * 0.52;
          const seat = { id: `hall_L_${r}_${c}`, isVip: false, pos: new THREE.Vector3(x, 0, z) };
          this.allCushions.push(seat);
          this.freeSeats.push(seat);
        }
        // Cánh hữu (phải)
        for (let c = 0; c < cols; c++) {
          const x = 0.65 + c * 0.52;
          const seat = { id: `hall_R_${r}_${c}`, isVip: false, pos: new THREE.Vector3(x, 0, z) };
          this.allCushions.push(seat);
          this.freeSeats.push(seat);
        }
      }
    }

    buildNoviceMonk() {
      this.noviceMonk = new NoviceMonk3D(this.scene, new THREE.Vector3(1.75, 0.25, -1.65), this.sharedMonkFaceTex);
    }

    setupParticles() {
      // Khói nhang 3D
      const smokeCount = 90;
      const smokeGeo = new THREE.BufferGeometry();
      const smokePos = new Float32Array(smokeCount * 3);
      const smokeSpd = new Float32Array(smokeCount);

      for (let i = 0; i < smokeCount; i++) {
        smokePos[i * 3 + 0] = (Math.random() - 0.5) * 0.14;
        smokePos[i * 3 + 1] = 0.95 + Math.random() * 2.5;
        smokePos[i * 3 + 2] = -1.95 + (Math.random() - 0.5) * 0.14;
        smokeSpd[i] = 0.008 + Math.random() * 0.012;
      }
      smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
      this.particles.smoke = new THREE.Points(
        smokeGeo,
        new THREE.PointsMaterial({ color: 0xecd9c6, size: 0.14, transparent: true, opacity: 0.45, depthWrite: false })
      );
      this.particles.smokeSpd = smokeSpd;
      this.scene.add(this.particles.smoke);

      // Cánh hoa sen rơi 3D
      const petalCount = 70;
      const petalGeo = new THREE.BufferGeometry();
      const petalPos = new Float32Array(petalCount * 3);
      const petalSpd = new Float32Array(petalCount);

      for (let i = 0; i < petalCount; i++) {
        petalPos[i * 3 + 0] = (Math.random() - 0.5) * 5.5;
        petalPos[i * 3 + 1] = 0.3 + Math.random() * 5.0;
        petalPos[i * 3 + 2] = -3.5 + Math.random() * 8.0;
        petalSpd[i] = 0.009 + Math.random() * 0.014;
      }
      petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
      this.particles.petals = new THREE.Points(
        petalGeo,
        new THREE.PointsMaterial({ color: 0xff8da1, size: 0.09, transparent: true, opacity: 0.82, depthWrite: false })
      );
      this.particles.petalSpd = petalSpd;
      this.scene.add(this.particles.petals);
    }

    spawnMasterDevotee() {
      const master = new Devotee3D(this.scene, {
        name: 'Thí Chủ Minh Tâm',
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

      const devotee = new Devotee3D(this.scene, {
        name: username,
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

    switchSanctuaryTheme(sceneName) {}

    animate() {
      requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Nến lung linh
      if (this.candleWarmth) {
        this.candleWarmth.intensity = 1.35 + Math.sin(elapsed * 7.5) * 0.22;
      }

      // Khói nhang bay
      if (this.particles.smoke) {
        const pos = this.particles.smoke.geometry.attributes.position.array;
        for (let i = 0; i < pos.length / 3; i++) {
          pos[i * 3 + 1] += this.particles.smokeSpd[i];
          pos[i * 3 + 0] += Math.sin(elapsed * 2.0 + i) * 0.0014;
          if (pos[i * 3 + 1] > 3.8) {
            pos[i * 3 + 1] = 0.95;
            pos[i * 3 + 0] = (Math.random() - 0.5) * 0.14;
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

      // Cập nhật hoạt cảnh NPC
      if (this.noviceMonk) this.noviceMonk.update(delta, elapsed);
      this.activeDevotees.forEach((dev) => dev.update(delta, elapsed));

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
      this.state = 'IDLE_PRAY';
      this.walkSpeed = 1.6;
      this.waypoints = [];
      this.currentWpIndex = 0;
      this.prostrationPhase = 0;
      this.prostrationTimer = 0;
      this.buildMesh();
    }

    buildMesh() {
      this.group = new THREE.Group();
      // Thu nhỏ tỷ lệ 0.76 để vừa khít bồ đoàn hoa sen
      this.group.scale.set(0.76, 0.76, 0.76);

      const robeMat = new THREE.MeshStandardMaterial({
        color: this.isMaster ? CONFIG.colors.robeMaster : CONFIG.colors.robeGrey,
        roughness: 0.68
      });
      const skinMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.skinTone,
        map: this.faceTexture,
        roughness: 0.45
      });
      const hairMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.hairBlack, roughness: 0.75 });

      // Hông & Áo Lam Dưới
      const hipsGeo = new THREE.CylinderGeometry(0.18, 0.23, 0.35, 12);
      this.hips = new THREE.Mesh(hipsGeo, robeMat);
      this.hips.position.y = 0.32;
      this.hips.castShadow = true;
      this.group.add(this.hips);

      // Thân Trên
      const torsoGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.38, 12);
      this.torso = new THREE.Mesh(torsoGeo, robeMat);
      this.torso.position.y = 0.35;
      this.torso.castShadow = true;
      this.hips.add(this.torso);

      // Đầu với Texture Khuôn Mặt Chibi Hoan Hỷ
      const headGeo = new THREE.SphereGeometry(0.15, 20, 20);
      this.head = new THREE.Mesh(headGeo, skinMat);
      this.head.position.y = 0.31;
      this.head.rotation.y = -Math.PI / 2; // Căn diện mặt về phía trước
      this.head.castShadow = true;
      this.torso.add(this.head);

      // Búi tóc Phật tử
      const hairBunGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const hairBun = new THREE.Mesh(hairBunGeo, hairMat);
      hairBun.position.set(-0.06, 0.12, 0);
      this.head.add(hairBun);

      // Hai tay chắp búp sen
      const armGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.26, 8);
      this.leftArm = new THREE.Mesh(armGeo, robeMat);
      this.leftArm.position.set(-0.16, 0.12, 0.05);
      this.leftArm.rotation.set(0.75, 0, -0.45);
      this.torso.add(this.leftArm);

      this.rightArm = new THREE.Mesh(armGeo, robeMat);
      this.rightArm.position.set(0.16, 0.12, 0.05);
      this.rightArm.rotation.set(0.75, 0, 0.45);
      this.torso.add(this.rightArm);

      const handsGeo = new THREE.BoxGeometry(0.08, 0.11, 0.04);
      this.hands = new THREE.Mesh(handsGeo, new THREE.MeshStandardMaterial({ color: CONFIG.colors.skinTone }));
      this.hands.position.set(0, 0.04, 0.22);
      this.torso.add(this.hands);

      // Chân
      const legGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.32, 8);
      this.leftLeg = new THREE.Mesh(legGeo, robeMat);
      this.leftLeg.position.set(-0.09, -0.18, 0);
      this.leftLeg.castShadow = true;
      this.hips.add(this.leftLeg);

      this.rightLeg = new THREE.Mesh(legGeo, robeMat);
      this.rightLeg.position.set(0.09, -0.18, 0);
      this.rightLeg.castShadow = true;
      this.hips.add(this.rightLeg);

      // Thẻ Danh Hiệu 3D Lơ Lửng Trên Đầu (3D Billboard Nametag)
      this.nameplateTexture = createNameplateTexture(this.name, this.merit, this.isVip);
      const nameplateGeo = new THREE.PlaneGeometry(0.68, 0.17);
      const nameplateMat = new THREE.MeshBasicMaterial({
        map: this.nameplateTexture,
        transparent: true,
        depthTest: false
      });
      this.nameplate = new THREE.Mesh(nameplateGeo, nameplateMat);
      this.nameplate.position.set(0, 1.25, 0);
      this.group.add(this.nameplate);

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
      this.group.position.set(0, 0, 4.5);
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

    update(delta, elapsed) {
      // Đảm bảo Thẻ Tên luôn hướng về phía Camera (Billboard)
      if (this.nameplate) {
        this.nameplate.rotation.y = -this.group.rotation.y;
      }

      if (this.state === 'IDLE_PRAY') {
        const breath = Math.sin(elapsed * 2.2 + this.group.position.x * 2.5);
        this.torso.position.y = 0.35 + breath * 0.012;
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
          this.leftLeg.rotation.x = walkCycle * 0.42;
          this.rightLeg.rotation.x = -walkCycle * 0.42;
          this.hips.position.y = 0.32 + Math.abs(Math.cos(elapsed * 9.5)) * 0.04;
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
            new THREE.Vector3(0, 0, this.returnSeatPos ? this.returnSeatPos.z : 0),
            this.returnSeatPos ? this.returnSeatPos.clone() : this.centralPos.clone()
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
      this.group.rotation.y = -Math.PI / 1.35;
      this.group.scale.set(0.78, 0.78, 0.78);

      const robeMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.robeMonk, roughness: 0.75 });
      const skinMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.skinTone,
        map: this.faceTex,
        roughness: 0.45
      });

      const bodyGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.52, 12);
      this.body = new THREE.Mesh(bodyGeo, robeMat);
      this.body.position.y = 0.26;
      this.body.castShadow = true;
      this.group.add(this.body);

      const headGeo = new THREE.SphereGeometry(0.16, 20, 20);
      this.head = new THREE.Mesh(headGeo, skinMat);
      this.head.position.y = 0.38;
      this.head.rotation.y = -Math.PI / 2;
      this.head.castShadow = true;
      this.body.add(this.head);

      const armGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.24, 8);
      this.rightArm = new THREE.Mesh(armGeo, robeMat);
      this.rightArm.position.set(0.16, 0.14, 0.05);
      this.rightArm.rotation.x = 0.6;
      this.body.add(this.rightArm);

      const malletGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8);
      const malletMat = new THREE.MeshStandardMaterial({ color: 0x9b1b1b, roughness: 0.3 });
      const mallet = new THREE.Mesh(malletGeo, malletMat);
      mallet.position.set(0, -0.12, 0.08);
      mallet.rotation.x = Math.PI / 3;
      this.rightArm.add(mallet);

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
        this.rightArm.rotation.x = 0.6 + Math.sin(this.strikeAnim * Math.PI) * 0.55;
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
