"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Pointer } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSplashState } from "@/hooks/useSplashState";

// ── Smooth Cursor SVG ─────────────────────────────────────────────────────────
function CursorArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 50 54" fill="none">
      <g filter="url(#cursor-shadow)">
        <path
          d="M42.68 41.15L27.51 6.8C26.73 5.03 24.21 5.03 23.39 6.8L7.6 41.15C6.76 42.98 8.53 44.89 10.41 44.2L24.38 39.05C24.88 38.86 25.44 38.86 25.94 39.05L39.81 44.2C41.68 44.89 43.49 42.98 42.68 41.15Z"
          fill="#00b4d8"
        />
        <path
          d="M43.71 40.69L28.54 6.34C27.36 3.65 23.58 3.7 22.37 6.33L6.57 40.68C5.31 43.42 7.97 46.3 10.8 45.25L24.77 40.11C25.02 40.01 25.3 40.02 25.55 40.11L39.42 45.25C42.23 46.3 44.93 43.43 43.71 40.69Z"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
      </g>
      <defs>
        <filter id="cursor-shadow" x="0.6" y="0.95" width="49" height="52.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a" />
          <feOffset dy="2.26" />
          <feGaussianBlur stdDeviation="2.26" />
          <feComposite in2="a" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="bg" result="shadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="shadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

// ── Math Helpers ──────────────────────────────────────────────────────────────
function pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0) param = dot / len_sq;
  let xx, yy;
  if (param < 0) { xx = x1; yy = y1; }
  else if (param > 1) { xx = x2; yy = y2; }
  else { xx = x1 + param * C; yy = y1 + param * D; }
  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

// ── Particle system types ─────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string;
  type: "trail" | "burst" | "spark" | "beam";
  angle?: number; thickness?: number; length?: number; ownerId?: number;
}
interface Enemy {
  id: number; x: number; y: number; vx: number; vy: number;
  active: boolean; life: number; maxLife: number; spawnAnim: number; lastShot: number; lastHit: number;
  type: "normal" | "miniboss" | "boss";
}
interface Projectile {
  x: number; y: number; vx: number; vy: number; active: boolean; life: number; ownerId?: number;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InteractionEffects({ onMouseMove }: { onMouseMove?: (x: number, y: number) => void; }) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const splashDone = useSplashState();
  const splashDoneRef = useRef(splashDone);
  useEffect(() => {
    splashDoneRef.current = splashDone;
  }, [splashDone]);

  const [isVisible, setIsVisible] = useState(false);
  const isActiveSectionRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorSize = 36;
  const cursorX = useSpring(-100, { stiffness: 1500, damping: 60, mass: 0.1 });
  const cursorY = useSpring(-100, { stiffness: 1500, damping: 60, mass: 0.1 });
  const shipX = useMotionValue(-100);
  const shipY = useMotionValue(-100);
  const rotation = useSpring(0, { stiffness: 300, damping: 60 });
  const scale = useSpring(1, { stiffness: 500, damping: 35 });

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastShipPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const isMouseDown = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const scoreRef = useRef(0);
  const scoreFlashRef = useRef({ color: '255, 255, 255', alpha: 0, scale: 1, lastUpdated: 0 });
  const playerHitRef = useRef(0);
  const lastEnemySpawn = useRef(0);
  const enemyIdCounter = useRef(0);

  const waveRef = useRef({
    number: 0,
    state: "between_waves" as "playing" | "between_waves",
    enemiesToSpawn: 0,
    nextWaveTime: 0,
    message: "",
    messageAlpha: 0,
  });

  const [showControls, setShowControls] = useState(false);
  const hasShownControlsRef = useRef(false);

  const enemiesDisabledRef = useRef(false);

  const keysDown = useRef<Set<string>>(new Set());
  const dashRef = useRef({ lastUsed: 0, cooldown: 1200, duration: 120, vx: 0, vy: 0, active: false, startTime: 0 });
  const shipVelRef = useRef({ x: 0, y: 0 });

  const holdRef = useRef<{ x: number; y: number; startTime: number; active: boolean }>({ x: 0, y: 0, startTime: 0, active: false });
  const hoverRef = useRef<{ x: number; y: number; w: number; h: number; active: boolean; alpha: number; }>({ x: 0, y: 0, w: 0, h: 0, active: false, alpha: 0 });
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = window.innerWidth < 1024; // Increased breakpoint to cover tablets
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsVisible(!(isPortrait || isMobile || isTouch || isMobileUserAgent));
    };
    check();
    window.addEventListener("resize", check);

    // Only active in contact and footer sections
    const handleScroll = () => {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          isActiveSectionRef.current = true;
        } else {
          isActiveSectionRef.current = false;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentPos = { x: e.clientX, y: e.clientY };
    mouseRef.current = currentPos;
    onMouseMove?.(e.clientX, e.clientY);

    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime.current;
    if (deltaTime > 0) {
      velocity.current = { x: (currentPos.x - lastMousePos.current.x) / deltaTime, y: (currentPos.y - lastMousePos.current.y) / deltaTime };
    }
    lastUpdateTime.current = currentTime;
    lastMousePos.current = currentPos;

    cursorX.set(currentPos.x);
    cursorY.set(currentPos.y);

    if (!isMouseDown.current) {
      scale.set(0.92);
      setTimeout(() => { if (!isMouseDown.current) scale.set(1); }, 150);
    }

    const target = e.target as HTMLElement;
    const hoverable = target?.closest?.("a, button, [role='button']") as HTMLElement | null;
    if (hoverable) {
      setIsHovering(true);
      const rect = hoverable.getBoundingClientRect();
      hoverRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width, h: rect.height, active: true, alpha: Math.min(hoverRef.current.alpha + 0.06, 0.7) };
    } else {
      setIsHovering(false);
      hoverRef.current.active = false;
    }
  }, [onMouseMove, cursorX, cursorY, shipX, shipY, rotation, scale]);

  useEffect(() => {
    if (!isVisible) { document.body.style.cursor = "auto"; return; }
    document.body.style.cursor = "none";
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const spawnExplosion = (ex: number, ey: number, color: string, sparksCount: number) => {
      for (let i = 0; i < sparksCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        particlesRef.current.push({
          x: ex, y: ey, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, maxLife: 0.3 + Math.random() * 0.4, size: 1 + Math.random() * 2,
          color, type: "burst",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const sx = shipX.get(), sy = shipY.get();
      if (!hoverRef.current.active) {
        const mx = e.clientX;
        const my = e.clientY;
        const dx = mx - sx;
        const dy = my - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = (rotation.get() - 90) * (Math.PI / 180);
        
        particlesRef.current.push({
          x: sx, y: sy, vx: Math.cos(angle) * 15, vy: Math.sin(angle) * 15,
          life: 1, maxLife: 0.25, size: 1, color: "0, 180, 216", type: "beam",
          angle: angle, thickness: 4, length: dist, ownerId: -1
        });
        
        const targetX = sx + Math.cos(angle) * dist;
        const targetY = sy + Math.sin(angle) * dist;
        spawnExplosion(targetX, targetY, "0, 180, 216", 10);
      }
      spawnExplosion(sx, sy, "255, 255, 255", 8);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true; scale.set(0.7);
      if (!hoverRef.current.active) {
        holdRef.current = { x: shipX.get(), y: shipY.get(), startTime: performance.now(), active: true };
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown.current = false; scale.set(1);
      if (holdRef.current.active) {
        const elapsed = (performance.now() - holdRef.current.startTime) / 1000;
        if (elapsed > 0.15) {
          const power = Math.min(elapsed, 2);
          const angle = (rotation.get() - 90) * (Math.PI / 180);
          const sx = shipX.get(), sy = shipY.get();
          
          particlesRef.current.push({
            x: sx, y: sy, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
            life: 1, maxLife: 0.4 + power * 0.2, size: 1, color: "124, 58, 237", type: "beam",
            angle: angle, thickness: 8 + power * 15, length: 3000, ownerId: -1
          });
          particlesRef.current.push({
            x: sx, y: sy, vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
            life: 1, maxLife: 0.3 + power * 0.2, size: 1, color: "255, 255, 255", type: "beam",
            angle: angle, thickness: 2 + power * 4, length: 3000, ownerId: -1
          });
          spawnExplosion(sx, sy, "124, 58, 237", Math.floor(10 + power * 20));
        }
      }
      holdRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseUp);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" || e.key === "Escape") {
        enemiesDisabledRef.current = !enemiesDisabledRef.current;
        if (enemiesDisabledRef.current) enemiesRef.current = [];
      }
      keysDown.current.add(e.key.toLowerCase());
      // Dash on LShift
      if (e.key === "Shift" && !e.repeat) {
        const now = performance.now();
        const dash = dashRef.current;
        if (now - dash.lastUsed > dash.cooldown) {
          dash.lastUsed = now;
          dash.active = true;
          dash.startTime = now;
          // Dash in movement direction, or forward if stationary
          let dx = 0, dy = 0;
          if (keysDown.current.has("w")) dy -= 1;
          if (keysDown.current.has("s")) dy += 1;
          if (keysDown.current.has("a")) dx -= 1;
          if (keysDown.current.has("d")) dx += 1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) { dash.vx = (dx / len) * 28; dash.vy = (dy / len) * 28; }
          else {
            const angle = (rotation.get() - 90) * (Math.PI / 180);
            dash.vx = Math.cos(angle) * 28; dash.vy = Math.sin(angle) * 28;
          }
          // Dash burst particles
          const bsx = shipX.get(), bsy = shipY.get();
          for (let i = 0; i < 12; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 3 + Math.random() * 6;
            particlesRef.current.push({
              x: bsx, y: bsy,
              vx: -dash.vx * 0.15 + Math.cos(a) * spd,
              vy: -dash.vy * 0.15 + Math.sin(a) * spd,
              life: 1, maxLife: 0.2 + Math.random() * 0.2, size: 1.5 + Math.random() * 2,
              color: "0, 220, 255", type: "burst",
            });
          }
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      let sx = shipX.get();
      let sy = shipY.get();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Ship spawns at bottom left if not yet placed
      if (sx === -100) {
        sx = 50;
        sy = canvas.height - 50;
        shipX.set(sx);
        shipY.set(sy);
      }

      // WASD acceleration-based movement
      const accelRate = 1.2;
      const maxSpeed = 9;
      const friction = 0.88;
      let inputX = 0, inputY = 0;
      if (keysDown.current.has("w")) inputY -= 1;
      if (keysDown.current.has("s")) inputY += 1;
      if (keysDown.current.has("a")) inputX -= 1;
      if (keysDown.current.has("d")) inputX += 1;
      const inputLen = Math.sqrt(inputX * inputX + inputY * inputY);
      if (inputLen > 0) {
        shipVelRef.current.x += (inputX / inputLen) * accelRate;
        shipVelRef.current.y += (inputY / inputLen) * accelRate;
      }
      // Clamp velocity
      const velMag = Math.sqrt(shipVelRef.current.x ** 2 + shipVelRef.current.y ** 2);
      if (velMag > maxSpeed) {
        shipVelRef.current.x = (shipVelRef.current.x / velMag) * maxSpeed;
        shipVelRef.current.y = (shipVelRef.current.y / velMag) * maxSpeed;
      }
      // Apply friction
      shipVelRef.current.x *= friction;
      shipVelRef.current.y *= friction;
      // Kill tiny drift
      if (Math.abs(shipVelRef.current.x) < 0.05) shipVelRef.current.x = 0;
      if (Math.abs(shipVelRef.current.y) < 0.05) shipVelRef.current.y = 0;
      sx += shipVelRef.current.x;
      sy += shipVelRef.current.y;

      // Dash
      const dash = dashRef.current;
      if (dash.active) {
        const dashT = (now - dash.startTime) / dash.duration; // 0..1
        if (dashT < 1) {
          // Ease-out dash
          const ease = 1 - dashT * dashT;
          sx += dash.vx * ease;
          sy += dash.vy * ease;
          // Afterimage particles — spawn behind the ship
          const dashBackAngle = (rotation.get() - 90) * (Math.PI / 180) + Math.PI;
          if (Math.random() < 0.8) {
            const bOff = 10 + Math.random() * 8;
            const spread = (Math.random() - 0.5) * 0.8;
            particlesRef.current.push({
              x: sx + Math.cos(dashBackAngle + spread) * bOff, y: sy + Math.sin(dashBackAngle + spread) * bOff,
              vx: Math.cos(dashBackAngle) * (2 + Math.random() * 3) + (Math.random() - 0.5) * 1.5,
              vy: Math.sin(dashBackAngle) * (2 + Math.random() * 3) + (Math.random() - 0.5) * 1.5,
              life: 1, maxLife: 0.25 + Math.random() * 0.15, size: 2 + Math.random() * 3,
              color: "0, 220, 255", type: "trail",
            });
          }
          // Speed lines — behind and to the sides of the ship
          if (Math.random() < 0.5) {
            const perpAngle = dashBackAngle + Math.PI / 2;
            const offset = (Math.random() - 0.5) * 24;
            particlesRef.current.push({
              x: sx + Math.cos(dashBackAngle) * 14 + Math.cos(perpAngle) * offset,
              y: sy + Math.sin(dashBackAngle) * 14 + Math.sin(perpAngle) * offset,
              vx: Math.cos(dashBackAngle) * (4 + Math.random() * 3),
              vy: Math.sin(dashBackAngle) * (4 + Math.random() * 3),
              life: 1, maxLife: 0.15, size: 1, color: "255, 255, 255", type: "burst",
            });
          }
        } else {
          dash.active = false;
        }
      }

      // Clamp to screen
      sx = Math.max(20, Math.min(canvas.width - 20, sx));
      sy = Math.max(20, Math.min(canvas.height - 20, sy));
      shipX.set(sx);
      shipY.set(sy);

      // Ship rotation (aim at cursor)
      const shipDx = mx - sx;
      const shipDy = my - sy;
      const shipDist = Math.sqrt(shipDx * shipDx + shipDy * shipDy);
      if (shipDist > 2) {
        const targetAngle = Math.atan2(shipDy, shipDx) * (180 / Math.PI) + 90;
        let angleDiff = targetAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = targetAngle;
      }

      // Ship trails (speed-based, spawned behind ship)
      const backAngle = (rotation.get() - 90) * (Math.PI / 180) + Math.PI; // opposite of aim
      const sDx = sx - (lastShipPos.current.x || sx);
      const sDy = sy - (lastShipPos.current.y || sy);
      const sSpeed = Math.sqrt(sDx * sDx + sDy * sDy);
      const trailChance = Math.min(0.9, sSpeed * 0.08);
      const trailCount = sSpeed > 5 ? 2 : 1;
      for (let ti = 0; ti < trailCount; ti++) {
        if (sSpeed > 0.5 && Math.random() < trailChance) {
          const trailSize = Math.min(3, 0.8 + sSpeed * 0.15);
          const tSpread = (Math.random() - 0.5) * 0.7;
          const tOff = 8 + Math.random() * 6;
          particlesRef.current.push({
            x: sx + Math.cos(backAngle + tSpread) * tOff,
            y: sy + Math.sin(backAngle + tSpread) * tOff,
            vx: Math.cos(backAngle) * (1.5 + Math.random() * 2) + (Math.random() - 0.5) * 0.8,
            vy: Math.sin(backAngle) * (1.5 + Math.random() * 2) + (Math.random() - 0.5) * 0.8,
            life: 1, maxLife: 0.3 + Math.random() * 0.3, size: trailSize,
            color: Math.random() > 0.35 ? "0, 180, 216" : "124, 58, 237", type: "trail",
          });
        }
      }
      // Engine glow sparks when moving fast (behind ship)
      if (sSpeed > 4 && Math.random() < 0.3) {
        const engSpread = (Math.random() - 0.5) * 0.5;
        particlesRef.current.push({
          x: sx + Math.cos(backAngle + engSpread) * 14,
          y: sy + Math.sin(backAngle + engSpread) * 14,
          vx: Math.cos(backAngle) * (2 + Math.random() * 3),
          vy: Math.sin(backAngle) * (2 + Math.random() * 3),
          life: 1, maxLife: 0.15 + Math.random() * 0.1, size: 1 + Math.random(),
          color: "255, 200, 50", type: "spark",
        });
      }
      lastShipPos.current = { x: sx, y: sy };

      // Determine active shield
      let shieldRadius = 0;
      if (holdRef.current.active) {
        const elapsed = (now - holdRef.current.startTime) / 1000;
        const power = Math.min(elapsed, 2);
        shieldRadius = 12 + power * 25;

        // Pull-in charging sparks
        if (Math.random() < 0.3) {
          const a = Math.random() * Math.PI * 2;
          const r = shieldRadius + 20 + Math.random() * 30;
          particlesRef.current.push({
             x: sx + Math.cos(a) * r,
             y: sy + Math.sin(a) * r,
             vx: -Math.cos(a) * (2 + power * 2),
             vy: -Math.sin(a) * (2 + power * 2),
             life: 1, maxLife: 0.3 + Math.random() * 0.2, size: 1 + Math.random(), color: "0, 180, 216", type: "spark"
          });
        }
      }

      // Screen shake if hit
      if (playerHitRef.current > 0) {
        playerHitRef.current = Math.max(0, playerHitRef.current - 0.05);
        const shake = playerHitRef.current * 10;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        
        // Red flash
        ctx.fillStyle = `rgba(255, 0, 0, ${playerHitRef.current * 0.2})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // ── Game Logic ──
      const wave = waveRef.current;
      if (splashDoneRef.current && pathnameRef.current === "/" && isActiveSectionRef.current) {
        if (wave.number === 0) {
           wave.number = 1; wave.state = "between_waves"; wave.nextWaveTime = now + 2000;
           wave.message = "WAVE 1"; wave.messageAlpha = 1; wave.enemiesToSpawn = 5;
           if (!hasShownControlsRef.current) {
             hasShownControlsRef.current = true;
             setShowControls(true);
           }
        }
        if (wave.state === "between_waves") {
          if (now > wave.nextWaveTime) wave.state = "playing";
        } else if (wave.state === "playing") {
          if (wave.enemiesToSpawn > 0 && now - lastEnemySpawn.current > Math.max(800, 2000 - wave.number * 200) && !enemiesDisabledRef.current) {
            lastEnemySpawn.current = now;
            wave.enemiesToSpawn--;
            
            const side = Math.floor(Math.random() * 4);
            let ex = 0, ey = 0;
            if (side === 0) { ex = Math.random() * canvas.width; ey = -50; }
            else if (side === 1) { ex = canvas.width + 50; ey = Math.random() * canvas.height; }
            else if (side === 2) { ex = Math.random() * canvas.width; ey = canvas.height + 50; }
            else { ex = -50; ey = Math.random() * canvas.height; }

            let type: "normal" | "miniboss" | "boss" = "normal";
            let maxLife = 1;
            if (wave.number % 4 === 0 && wave.enemiesToSpawn === 0) {
               type = "boss"; maxLife = 40;
            } else if (wave.number % 2 === 0 && wave.enemiesToSpawn < (wave.number / 2)) {
               type = "miniboss"; maxLife = 10;
            } else {
               type = "normal"; maxLife = 2;
            }
            enemiesRef.current.push({ id: enemyIdCounter.current++, x: ex, y: ey, vx: 0, vy: 0, active: true, life: maxLife, maxLife, spawnAnim: 0, type, lastShot: now, lastHit: 0 });
          }

          if (wave.enemiesToSpawn === 0 && enemiesRef.current.length === 0) {
            wave.state = "between_waves";
            wave.number++;
            wave.nextWaveTime = now + 4000;
            wave.message = wave.number % 4 === 0 ? "WARNING: BOSS APPROACHING" : `WAVE ${wave.number}`;
            wave.messageAlpha = 1;
            if (wave.number % 4 === 0) wave.enemiesToSpawn = 1;
            else if (wave.number % 2 === 0) wave.enemiesToSpawn = 4 + wave.number;
            else wave.enemiesToSpawn = 3 + wave.number * 2;
          }
        }
      }

      // Update enemies
      enemiesRef.current = enemiesRef.current.filter(e => e.active);
      for (const e of enemiesRef.current) {
        e.spawnAnim = Math.min(1, e.spawnAnim + 0.05);
        const dx = sx - e.x;
        const dy = sy - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = e.type === "boss" ? 40 : e.type === "miniboss" ? 20 : 15;

        // Shield collision logic
        if (shieldRadius > 0 && dist < shieldRadius + hitRadius) {
            e.life -= 1;
            if (e.life <= 0) {
              e.active = false;
              scoreRef.current += e.type === "boss" ? 1000 : e.type === "miniboss" ? 300 : 100;
              scoreFlashRef.current = { color: '255, 255, 255', alpha: 1, scale: 2, lastUpdated: performance.now() };
              spawnExplosion(e.x, e.y, "255, 255, 255", e.type === "boss" ? 40 : 15);
              continue;
            } else {
              e.vx -= (dx / dist) * 5;
              e.vy -= (dy / dist) * 5;
              spawnExplosion(e.x, e.y, "124, 58, 237", 2);
            }
        }
        
        // Keep distance from cursor
        const desiredDist = e.type === "boss" ? 300 : e.type === "miniboss" ? 150 : 200;
        const accel = e.type === "boss" ? 0.02 : e.type === "miniboss" ? 0.04 : 0.05;
        if (dist > desiredDist) { 
           e.vx += (dx / dist) * accel; 
           e.vy += (dy / dist) * accel; 
        } else if (dist < desiredDist - 30) {
           e.vx -= (dx / dist) * accel; 
           e.vy -= (dy / dist) * accel; 
        } else {
           e.vx *= 0.9; e.vy *= 0.9; 
        }
        e.vx *= 0.95; e.vy *= 0.95;
        e.x += e.vx; e.y += e.vy;

        // Enemy shooting
        const shootCooldown = e.type === "boss" ? 1500 : e.type === "miniboss" ? 2000 : 3000 + Math.random() * 2000;
        if (now - e.lastShot > shootCooldown && dist < 700) {
          e.lastShot = now;
          if (e.type === "normal") {
            const pAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2;
            projectilesRef.current.push({ x: e.x, y: e.y, vx: Math.cos(pAngle) * 6, vy: Math.sin(pAngle) * 6, active: true, life: 1, ownerId: e.id });
          } else if (e.type === "miniboss") {
            const baseAngle = Math.atan2(dy, dx);
            for (let i = -1; i <= 1; i++) {
               const pAngle = baseAngle + i * 0.3;
               projectilesRef.current.push({ x: e.x, y: e.y, vx: Math.cos(pAngle) * 7, vy: Math.sin(pAngle) * 7, active: true, life: 1, ownerId: e.id });
            }
          } else if (e.type === "boss") {
            for (let i = 0; i < 16; i++) {
               const pAngle = (Math.PI * 2 / 16) * i + (now / 1000);
               projectilesRef.current.push({ x: e.x, y: e.y, vx: Math.cos(pAngle) * 5, vy: Math.sin(pAngle) * 5, active: true, life: 1, ownerId: e.id });
            }
            const bossAngle = Math.atan2(sy - e.y, sx - e.x);
            particlesRef.current.push({
               x: e.x, y: e.y, vx: 0, vy: 0,
               life: 1, maxLife: 0.6, size: 1, color: "180, 0, 255", type: "beam",
               angle: bossAngle, thickness: 15, length: 2500, ownerId: e.id
            });
          }
        }

        // Draw Enemy
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(Math.atan2(e.vy, e.vx) + Math.PI / 2);
        const scaleMod = e.type === "boss" ? 4 : e.type === "miniboss" ? 2 : 1;
        ctx.scale(e.spawnAnim * scaleMod, e.spawnAnim * scaleMod);
        ctx.beginPath();
        if (e.type === "boss") {
           ctx.moveTo(0, -15); ctx.lineTo(15, 15); ctx.lineTo(0, 5); ctx.lineTo(-15, 15); ctx.closePath();
           ctx.fillStyle = "rgba(180, 0, 255, 0.8)";
           ctx.strokeStyle = "purple";
        } else if (e.type === "miniboss") {
           ctx.moveTo(0, -12); ctx.lineTo(12, 12); ctx.lineTo(0, 4); ctx.lineTo(-12, 12); ctx.closePath();
           ctx.fillStyle = "rgba(255, 150, 0, 0.8)";
           ctx.strokeStyle = "orange";
        } else {
           ctx.moveTo(0, -10); ctx.lineTo(10, 10); ctx.lineTo(0, 5); ctx.lineTo(-10, 10); ctx.closePath();
           ctx.fillStyle = "rgba(255, 50, 50, 0.8)";
           ctx.strokeStyle = "red";
        }
        ctx.fill();
        ctx.lineWidth = 1.5; ctx.stroke();
        
        // Draw Health Bar
        if (e.life < e.maxLife) {
           ctx.rotate(-Math.atan2(e.vy, e.vx) - Math.PI / 2);
           ctx.fillStyle = "rgba(255,0,0,0.5)";
           ctx.fillRect(-15, -20, 30, 4);
           ctx.fillStyle = "rgba(0,255,0,0.8)";
           ctx.fillRect(-15, -20, 30 * (e.life / e.maxLife), 4);
        }
        ctx.restore();
      }

      // Update projectiles
      projectilesRef.current = projectilesRef.current.filter(p => p.active && p.life > 0.01);
      for (const p of projectilesRef.current) {
        p.life = Math.max(0, p.life - 0.01);
        p.x += p.vx; p.y += p.vy;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.ownerId === -1 ? "rgba(0, 180, 216, 0.9)" : "rgba(255, 100, 100, 0.9)";
        ctx.fill();
        // Removed expensive shadowBlur for projectiles to fix lag
        ctx.fill();

        // Friendly Fire & Player Hit Check
        let hitEnemy = false;
        for (const e of enemiesRef.current) {
          if (!e.active || e.id === p.ownerId) continue;
          const hitRadius = e.type === "boss" ? 40 : e.type === "miniboss" ? 20 : 15;
          if (Math.sqrt((e.x - p.x)**2 + (e.y - p.y)**2) < hitRadius) {
            hitEnemy = true;
            e.life -= p.ownerId === -1 ? 2 : 1; // Player bullets deal 2 dmg
            p.active = false;
            spawnExplosion(p.x, p.y, p.ownerId === -1 ? "0, 180, 216" : "255, 100, 100", 5);
            if (e.life <= 0) {
               e.active = false;
               scoreRef.current += e.type === "boss" ? 1000 : e.type === "miniboss" ? 300 : 100;
               scoreFlashRef.current = { color: '255, 255, 255', alpha: 1, scale: 2, lastUpdated: performance.now() };
               spawnExplosion(e.x, e.y, "255, 255, 255", e.type === "boss" ? 40 : 15);
            }
            break;
          }
        }
        if (hitEnemy) continue;

        // Player / Shield hit check (only for enemy bullets)
        if (p.ownerId !== -1) {
          const dMouse = Math.sqrt((sx - p.x)**2 + (sy - p.y)**2);
          
          if (shieldRadius > 0 && dMouse < shieldRadius + 5) {
            p.active = false;
            spawnExplosion(p.x, p.y, "0, 180, 216", 5); // shield blocks it
          } else if (dMouse < 15) {
            p.active = false;
            playerHitRef.current = 1.0;
            scoreRef.current -= 50;
            scoreFlashRef.current = { color: '255, 50, 50', alpha: 1, scale: 2, lastUpdated: performance.now() };
          }
        }
      }

      // ── Particles & Beams ──
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.01);
      for (const p of particlesRef.current) {
        p.life = Math.max(0, p.life - 1 / 60 / p.maxLife);
        p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96;
        const alpha = p.life;

        if (p.type === "trail") {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.5})`; ctx.fill();
        } else if (p.type === "burst") {
          const len = p.size * 3 * p.life;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * len * 0.3, p.y - p.vy * len * 0.3);
          ctx.strokeStyle = `rgba(${p.color}, ${alpha * 0.8})`; ctx.lineWidth = p.size * p.life; ctx.stroke();
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.6 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`; ctx.fill();
        } else if (p.type === "beam") {
          const len = p.length || 100; const thick = p.thickness || 2; const a = p.angle || 0;
          const endX = p.x + Math.cos(a) * len * p.life;
          const endY = p.y + Math.sin(a) * len * p.life;
          
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(endX, endY);
          ctx.strokeStyle = `rgba(${p.color}, ${alpha})`; ctx.lineWidth = thick * p.life; ctx.lineCap = "round"; ctx.stroke();
          ctx.shadowColor = `rgba(${p.color}, ${alpha * 0.8})`; ctx.shadowBlur = thick * 2; ctx.stroke(); ctx.shadowBlur = 0;

          // Collision check
          if (p.ownerId === -1) {
            for (const e of enemiesRef.current) {
              if (!e.active) continue;
              const dist = pointToLineDistance(e.x, e.y, p.x, p.y, endX, endY);
              const hitRadius = e.type === "boss" ? 50 : e.type === "miniboss" ? 30 : 20;
              if (dist < hitRadius + 10 && now - e.lastHit > 150) {
                e.life -= 1;
                e.lastHit = now;
                if (Math.random() < 0.2) spawnExplosion(e.x, e.y, "0, 180, 216", 2);
                if (e.life <= 0) {
                  e.active = false;
                  scoreRef.current += e.type === "boss" ? 1000 : e.type === "miniboss" ? 300 : 100;
                  scoreFlashRef.current = { color: '255, 255, 255', alpha: 1, scale: 2, lastUpdated: performance.now() };
                  spawnExplosion(e.x, e.y, "255, 255, 255", e.type === "boss" ? 40 : 15);
                }
              }
            }
          } else {
            const dMouse = pointToLineDistance(sx, sy, p.x, p.y, endX, endY);
            if (shieldRadius > 0 && dMouse < shieldRadius + 15) {
               if (Math.random() < 0.2) spawnExplosion(sx, sy, "0, 180, 216", 2);
            } else if (dMouse < 20) {
               playerHitRef.current = 1.0;
               scoreRef.current -= 50;
               scoreFlashRef.current = { color: '255, 50, 50', alpha: 1, scale: 2, lastUpdated: performance.now() };
            }
          }
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.9})`; ctx.fill();
        }
      }

      if (playerHitRef.current > 0) { ctx.resetTransform(); } // restore transform after shake

      // Score Juice update
      if (scoreFlashRef.current.alpha > 0) {
        scoreFlashRef.current.alpha -= 0.05;
        scoreFlashRef.current.scale = Math.max(1, scoreFlashRef.current.scale - 0.1);
      }

      // Draw Score (pixel font, just numbers, larger, fades out)
      const timeSinceUpdate = now - (scoreFlashRef.current.lastUpdated || 0);
      if (scoreRef.current !== 0 && timeSinceUpdate < 3000) {
        const textScale = scoreFlashRef.current.alpha > 0 ? scoreFlashRef.current.scale : 1;
        
        let textAlpha = 0.8;
        if (timeSinceUpdate > 2000) {
           textAlpha = 0.8 * (1 - (timeSinceUpdate - 2000) / 1000); // fade out over last second
        }

        ctx.font = `bold ${24 * textScale}px var(--font-kode-mono), monospace`;
        if (scoreFlashRef.current.alpha > 0) {
          ctx.fillStyle = `rgba(${scoreFlashRef.current.color}, ${Math.max(textAlpha, scoreFlashRef.current.alpha)})`;
        } else {
          ctx.fillStyle = `rgba(0, 180, 216, ${textAlpha})`;
        }
        ctx.fillText(`${scoreRef.current}`, sx + 30, sy - 30);
      }

      // Draw Wave Message (centered on screen)
      if (wave.messageAlpha > 0) {
         ctx.font = `bold ${40}px var(--font-kode-mono), monospace`;
         ctx.textAlign = "center";
         ctx.fillStyle = `rgba(0, 180, 216, ${wave.messageAlpha})`;
         ctx.shadowColor = `rgba(0, 180, 216, ${wave.messageAlpha * 0.5})`;
         ctx.shadowBlur = 20;
         ctx.fillText(wave.message, canvas.width / 2, canvas.height / 2 - 60);
         ctx.shadowBlur = 0;
         ctx.textAlign = "left";
         if (wave.state === "playing") wave.messageAlpha = Math.max(0, wave.messageAlpha - 0.01);
      }

      // ── Dash Cooldown Bar ──
      const dashCD = dashRef.current;
      const dashElapsed = now - dashCD.lastUsed;
      const dashReady = dashElapsed >= dashCD.cooldown;
      const dashCooldownPct = Math.min(1, dashElapsed / dashCD.cooldown);
      
      const barWidth = 36;
      const barHeight = 4;
      const barYOffset = -40; // above the ship
      
      if (!dashReady && dashCD.lastUsed > 0) {
        ctx.save();
        ctx.translate(sx, sy);
        
        // Background bar
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(-barWidth / 2, barYOffset, barWidth, barHeight);
        
        // Foreground bar (fills up)
        ctx.fillStyle = `rgba(0, 180, 216, ${0.5 + dashCooldownPct * 0.5})`;
        ctx.shadowColor = `rgba(0, 180, 216, ${dashCooldownPct * 0.5})`;
        ctx.shadowBlur = 5;
        ctx.fillRect(-barWidth / 2, barYOffset, barWidth * dashCooldownPct, barHeight);
        
        ctx.restore();
      } else if (dashReady && dashCD.lastUsed > 0 && dashElapsed < dashCD.cooldown + 500) {
        // Ready flash - fade out over 500ms after ready
        const fadeT = (dashElapsed - dashCD.cooldown) / 500;
        const flashAlpha = 1 - fadeT;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.fillStyle = `rgba(0, 220, 255, ${flashAlpha})`;
        ctx.shadowColor = `rgba(0, 220, 255, ${flashAlpha})`;
        ctx.shadowBlur = 8;
        ctx.fillRect(-barWidth / 2 - 2, barYOffset - 1, barWidth + 4, barHeight + 2);
        ctx.restore();
      }

      // ── Dash flash overlay ──
      if (dash.active) {
        const flashT = (now - dash.startTime) / dash.duration;
        if (flashT < 0.3) {
          ctx.fillStyle = `rgba(0, 220, 255, ${(0.3 - flashT) * 0.15})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // ── Hold orbital rings (Shield) ──
      if (holdRef.current.active) {
        const elapsed = (now - holdRef.current.startTime) / 1000;
        const hx = sx; 
        const hy = sy;
        const power = Math.min(elapsed, 2);
        const baseRadius = 12 + power * 25;
        const pulseAlpha = Math.min(elapsed * 0.6, 0.7);

        ctx.save(); ctx.translate(hx, hy); ctx.rotate(elapsed * 2);
        ctx.setLineDash([4 + power * 2, 8]); ctx.beginPath(); ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 58, 237, ${pulseAlpha})`; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
        ctx.rotate(-elapsed * 3.5); ctx.setLineDash([2, 12]); ctx.beginPath(); ctx.arc(0, 0, baseRadius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 180, 216, ${pulseAlpha * 0.6})`; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        const dotCount = 3 + Math.floor(power * 2);
        for (let i = 0; i < dotCount; i++) {
          const dotAngle = elapsed * 3 + (Math.PI * 2 * i) / dotCount;
          const dotR = baseRadius + Math.sin(elapsed * 5 + i) * 4;
          ctx.beginPath(); ctx.arc(Math.cos(dotAngle) * dotR, Math.sin(dotAngle) * dotR, 1.5 + power * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${pulseAlpha})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(0, 0, 2 + Math.sin(elapsed * 8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${pulseAlpha * 0.8})`; ctx.fill(); ctx.restore();
      }

      // ── Hover corner brackets ──
      const glow = hoverRef.current;
      if (glow.active) glow.alpha = Math.min(glow.alpha + 0.04, 0.6); else glow.alpha *= 0.88;
      if (glow.alpha > 0.01) {
        const pad = 10; const rx = glow.x - glow.w / 2 - pad; const ry = glow.y - glow.h / 2 - pad;
        const rw = glow.w + pad * 2; const rh = glow.h + pad * 2; const cl = Math.min(12, rw * 0.3, rh * 0.3);
        ctx.strokeStyle = `rgba(0, 180, 216, ${glow.alpha})`; ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(0, 180, 216, ${glow.alpha * 0.5})`; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(rx, ry + cl); ctx.lineTo(rx, ry); ctx.lineTo(rx + cl, ry); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + rw - cl, ry); ctx.lineTo(rx + rw, ry); ctx.lineTo(rx + rw, ry + cl); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + rw, ry + rh - cl); ctx.lineTo(rx + rw, ry + rh); ctx.lineTo(rx + rw - cl, ry + rh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + cl, ry + rh); ctx.lineTo(rx, ry + rh); ctx.lineTo(rx, ry + rh - cl); ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId); window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("click", handleClick);
      window.removeEventListener("mousedown", handleMouseDown); window.removeEventListener("mouseup", handleMouseUp); window.removeEventListener("mouseleave", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.body.style.cursor = "auto";
    };
  }, [handleMouseMove, isVisible, scale]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[99999]" />
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-24 right-8 z-[999999] pointer-events-auto bg-black/80 border border-[#00b4d8] p-6 backdrop-blur-md rounded-xl max-w-sm font-[family-name:var(--font-tech)]"
            style={{ boxShadow: "0 0 20px rgba(0, 180, 216, 0.2)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#00b4d8] text-xl font-bold uppercase tracking-widest">Controls</h3>
              <button 
                onClick={() => setShowControls(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[#00b4d8] font-bold tracking-widest">WASD</kbd>
                <span>Move Ship</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[#00b4d8] font-bold tracking-widest">CLICK</kbd>
                <span>Shoot</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[#00b4d8] font-bold tracking-widest">HOLD</kbd>
                <span>Energy Shield</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[#00b4d8] font-bold tracking-widest">SHIFT</kbd>
                <span>Dash</span>
              </li>
              <li className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-purple-400 font-bold tracking-widest">F / ESC</kbd>
                <span>Toggle Enemies</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ship */}
      <motion.div
        style={{ position: "fixed", top: 0, left: 0, x: shipX, y: shipY, rotate: rotation, scale: scale, originX: 0, originY: 0, zIndex: 999998, pointerEvents: "none", willChange: "transform" }}
      >
        <div style={{ transform: "translate(-17px, -5px)", width: cursorSize, height: cursorSize }}>
          <CursorArrow />
        </div>
      </motion.div>

      {/* Crosshair - animated rotating reticle */}
      <motion.div
        style={{ position: "fixed", top: 0, left: 0, x: cursorX, y: cursorY, scale: scale, originX: 0, originY: 0, zIndex: 999999, pointerEvents: "none", willChange: "transform" }}
      >
        {isHovering ? (
          <div style={{ transform: "translate(-12px, -4px)" }}>
            <Pointer className="w-8 h-8 text-[#00b4d8]" fill="#00b4d8" />
          </div>
        ) : (
          <div style={{ transform: "translate(-12px, -12px)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(255,51,102,0.8))" }}>
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="8" />
              <line x1="12" y1="16" x2="12" y2="22" />
              <line x1="2" y1="12" x2="8" y2="12" />
              <line x1="16" y1="12" x2="22" y2="12" />
            </svg>
          </div>
        )}
      </motion.div>
    </>
  );
}
