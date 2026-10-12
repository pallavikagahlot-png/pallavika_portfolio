/**
 * Blueprint Canvas Background Animation
 * Renders subtle geometric CAD line art, rotating coordinate marks,
 * and technical crosshairs inspired by mechanical drafting.
 */

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'blueprintCanvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  // Nodes for mechanical grid
  const nodes = [];
  const nodeCount = Math.min(28, Math.floor((width * height) / 45000));

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
      type: Math.random() > 0.6 ? 'cross' : 'circle',
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01
    });
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      line: isDark ? 'rgba(56, 189, 248, 0.09)' : 'rgba(2, 132, 199, 0.08)',
      accent: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)',
      dim: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 70, 229, 0.08)'
    };
  }

  let lastTime = 0;
  function animate(timestamp) {
    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);
    const colors = getThemeColors();

    // Draw connecting technical blueprint lines between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      nodeA.x += nodeA.vx;
      nodeA.y += nodeA.vy;
      nodeA.angle += nodeA.spin;

      // Wrap edges
      if (nodeA.x < 0) nodeA.x = width;
      if (nodeA.x > width) nodeA.x = 0;
      if (nodeA.y < 0) nodeA.y = height;
      if (nodeA.y > height) nodeA.y = 0;

      // Connect with other nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeB = nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          ctx.beginPath();
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 1;
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();

          // Occasionally draw a tiny technical midpoint dimension tick
          if (dist > 80 && dist < 120 && (i + j) % 5 === 0) {
            const midX = (nodeA.x + nodeB.x) / 2;
            const midY = (nodeA.y + nodeB.y) / 2;
            ctx.beginPath();
            ctx.strokeStyle = colors.dim;
            ctx.arc(midX, midY, 2, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Draw node element (either crosshair or circle)
      ctx.save();
      ctx.translate(nodeA.x, nodeA.y);
      ctx.rotate(nodeA.angle);

      if (nodeA.type === 'cross') {
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        const len = 4;
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.lineTo(len, 0);
        ctx.moveTo(0, -len);
        ctx.lineTo(0, len);
        ctx.stroke();
      } else {
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, nodeA.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Interactive subtle cursor blueprint crosshair (very subtle)
    ctx.save();
    ctx.strokeStyle = colors.line;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(mouseX, 0);
    ctx.lineTo(mouseX, height);
    ctx.moveTo(0, mouseY);
    ctx.lineTo(width, mouseY);
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
