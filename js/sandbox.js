// Gravity Sandbox Physics Simulation
(function () {
  const canvas = document.getElementById("sandboxCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  let width = (canvas.width = container.clientWidth);
  let height = (canvas.height = container.clientHeight);

  // Device pixel ratio for crisp rendering
  function setupCanvasSize() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);
  }
  setupCanvasSize();

  // Bubble data definition with premium colors matching the palette
  const labels = [
    {
      text: "AI Integration",
      color: "rgba(99, 102, 241, 0.08)",
      border: "rgba(99, 102, 241, 0.4)",
      textCol: "#4f46e5",
    },
    {
      text: "Visibility",
      color: "rgba(16, 185, 129, 0.08)",
      border: "rgba(16, 185, 129, 0.4)",
      textCol: "#059669",
    },
    {
      text: "Performance",
      color: "rgba(139, 92, 246, 0.08)",
      border: "rgba(139, 92, 246, 0.4)",
      textCol: "#7c3aed",
    },
    {
      text: "Marketing",
      color: "rgba(245, 158, 11, 0.08)",
      border: "rgba(245, 158, 11, 0.4)",
      textCol: "#d97706",
    },
    {
      text: "Compounding",
      color: "rgba(244, 63, 94, 0.08)",
      border: "rgba(244, 63, 94, 0.4)",
      textCol: "#e11d48",
    },
    {
      text: "Social Campaigns",
      color: "rgba(14, 165, 233, 0.08)",
      border: "rgba(14, 165, 233, 0.4)",
      textCol: "#0284c7",
    },
    {
      text: "Growth",
      color: "rgba(217, 70, 239, 0.08)",
      border: "rgba(217, 70, 239, 0.4)",
      textCol: "#c026d3",
    },
    {
      text: "ROAS",
      color: "rgba(20, 184, 166, 0.08)",
      border: "rgba(20, 184, 166, 0.4)",
      textCol: "#0d9488",
    },
  ];

  let bubbles = [];

  function initBubbles() {
    bubbles = [];
    const isMobile = width < 768;

    labels.forEach((item, idx) => {
      const charCount = item.text.length;
      // Bubble sizing scale based on label text length and canvas width
      const baseRadius = isMobile
        ? 32 + charCount * 1.5
        : 45 + charCount * 2.2;
      const radius = Math.max(
        isMobile ? 35 : 50,
        Math.min(isMobile ? 60 : 85, baseRadius),
      );

      // Random position in the top half to let them drop
      const x = radius + Math.random() * (width - radius * 2);
      const y = radius + Math.random() * (height / 2 - radius);

      bubbles.push({
        text: item.text,
        color: item.color,
        border: item.border,
        textCol: item.textCol,
        radius: radius,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2,
        mass: radius,
        isDragging: false,
      });
    });
  }

  initBubbles();

  // Physics constants
  const gravity = 0.25;
  const damping = 0.985;
  const bounce = -0.6; // Bounciness/restitution coefficient

  // Interaction state
  let cursorX = -1000;
  let cursorY = -1000;
  let cursorActive = false;
  let draggedBubble = null;
  let lastMouseX = 0,
    lastMouseY = 0;
  let mouseVx = 0,
    mouseVy = 0;

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function handlePointerDown(e) {
    const pos = getPointerPos(e);
    cursorX = pos.x;
    cursorY = pos.y;
    cursorActive = true;
    lastMouseX = cursorX;
    lastMouseY = cursorY;
    mouseVx = 0;
    mouseVy = 0;

    // Hit test bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      const dist = Math.hypot(b.x - cursorX, b.y - cursorY);
      if (dist < b.radius) {
        draggedBubble = b;
        b.isDragging = true;
        b.vx = 0;
        b.vy = 0;
        break;
      }
    }
  }

  function handlePointerMove(e) {
    const pos = getPointerPos(e);
    cursorX = pos.x;
    cursorY = pos.y;
    cursorActive = true;

    mouseVx = cursorX - lastMouseX;
    mouseVy = cursorY - lastMouseY;
    lastMouseX = cursorX;
    lastMouseY = cursorY;

    if (draggedBubble) {
      draggedBubble.x = cursorX;
      draggedBubble.y = cursorY;
      draggedBubble.vx = mouseVx;
      draggedBubble.vy = mouseVy;
    }
  }

  function handlePointerUp() {
    if (draggedBubble) {
      draggedBubble.isDragging = false;
      const maxFling = 15;
      draggedBubble.vx = Math.max(-maxFling, Math.min(maxFling, mouseVx));
      draggedBubble.vy = Math.max(-maxFling, Math.min(maxFling, mouseVy));
      draggedBubble = null;
    }
    cursorActive = false;
    cursorX = -1000;
    cursorY = -1000;
  }

  // Desktop Mouse interaction
  container.addEventListener("mousedown", handlePointerDown);
  window.addEventListener("mousemove", (e) => {
    if (draggedBubble) {
      handlePointerMove(e);
    } else {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        cursorX = e.clientX - rect.left;
        cursorY = e.clientY - rect.top;
        cursorActive = true;
      } else {
        cursorActive = false;
      }
    }
  });
  window.addEventListener("mouseup", handlePointerUp);

  // Mobile Touch interaction with smart scroll override
  container.addEventListener(
    "touchstart",
    (e) => {
      const pos = getPointerPos(e);
      let hit = false;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        const dist = Math.hypot(b.x - pos.x, b.y - pos.y);
        if (dist < b.radius) {
          hit = true;
          break;
        }
      }
      if (hit) {
        e.preventDefault(); // Stop body scrolling only if touching a physics bubble
        handlePointerDown(e);
      }
    },
    { passive: false },
  );

  container.addEventListener(
    "touchmove",
    (e) => {
      if (draggedBubble) {
        e.preventDefault();
        handlePointerMove(e);
      }
    },
    { passive: false },
  );

  container.addEventListener("touchend", (e) => {
    if (draggedBubble) {
      handlePointerUp();
    }
  });

  // Resizing window handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setupCanvasSize();
      initBubbles();
    }, 250);
  });

  // Circle-to-circle collision resolution
  function resolveCollisions() {
    for (let i = 0; i < bubbles.length; i++) {
      const b1 = bubbles[i];
      for (let j = i + 1; j < bubbles.length; j++) {
        const b2 = bubbles[j];

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist) {
          const overlap = minDist - dist;
          const nx = dist > 0 ? dx / dist : 1;
          const ny = dist > 0 ? dy / dist : 0;

          const totalMass = b1.mass + b2.mass;

          // Positional correction
          if (!b1.isDragging && !b2.isDragging) {
            b1.x -= nx * overlap * (b2.mass / totalMass);
            b1.y -= ny * overlap * (b2.mass / totalMass);
            b2.x += nx * overlap * (b1.mass / totalMass);
            b2.y += ny * overlap * (b1.mass / totalMass);
          } else if (b1.isDragging) {
            b2.x += nx * overlap;
            b2.y += ny * overlap;
          } else if (b2.isDragging) {
            b1.x -= nx * overlap;
            b1.y -= ny * overlap;
          }

          // Elastic collision response
          const rvx = b2.vx - b1.vx;
          const rvy = b2.vy - b1.vy;
          const velAlongNormal = rvx * nx + rvy * ny;

          if (velAlongNormal < 0) {
            const restitution = 0.75;
            let impulse = -(1 + restitution) * velAlongNormal;
            impulse /= 1 / b1.mass + 1 / b2.mass;

            if (!b1.isDragging) {
              b1.vx -= (impulse / b1.mass) * nx;
              b1.vy -= (impulse / b1.mass) * ny;
            }
            if (!b2.isDragging) {
              b2.vx += (impulse / b2.mass) * nx;
              b2.vy += (impulse / b2.mass) * ny;
            }
          }
        }
      }
    }
  }

  // Frame physics update
  function update() {
    bubbles.forEach((b) => {
      if (b.isDragging) return;

      // Cursor repulsion
      if (cursorActive && draggedBubble === null) {
        const distToCursor = Math.hypot(b.x - cursorX, b.y - cursorY);
        const repulsionRadius = 140;
        if (distToCursor < repulsionRadius) {
          const force =
            (repulsionRadius - distToCursor) / repulsionRadius;
          const angle = Math.atan2(b.y - cursorY, b.x - cursorX);
          b.vx += Math.cos(angle) * force * 0.7;
          b.vy += Math.sin(angle) * force * 0.7;
        }
      }

      // Apply gravity & damping
      b.vy += gravity;
      b.vx *= damping;
      b.vy *= damping;

      b.x += b.vx;
      b.y += b.vy;
    });

    // Run collision & wall checks iteratively for rigidity
    for (let step = 0; step < 2; step++) {
      resolveCollisions();

      bubbles.forEach((b) => {
        if (b.isDragging) return;

        // Bottom boundary
        if (b.y + b.radius > height) {
          b.y = height - b.radius;
          b.vy *= bounce;
          b.vx *= 0.95; // Ground friction
        }
        // Top boundary
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy *= bounce;
        }
        // Left boundary
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx *= bounce;
        }
        // Right boundary
        if (b.x + b.radius > width) {
          b.x = width - b.radius;
          b.vx *= bounce;
        }
      });
    }
  }

  // Render loop
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Subtle grid matrix background
    ctx.strokeStyle = "rgba(9, 13, 22, 0.02)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render bubbles
    bubbles.forEach((b) => {
      ctx.save();

      // Bubble soft drop shadow
      ctx.shadowColor = "rgba(9, 13, 22, 0.03)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;

      ctx.fillStyle = b.color;
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Bubble Typography
      ctx.fillStyle = b.textCol;
      const fontSize = Math.max(
        10,
        Math.min(14, b.radius * 0.22 - b.text.length * 0.08),
      );
      ctx.font = `600 ${fontSize}px 'Sora', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.text, b.x, b.y);

      ctx.restore();
    });
  }

  function frame() {
    update();
    draw();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
