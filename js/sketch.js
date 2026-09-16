/* Finger sketch pad. Supports a "blind" mode for blind-contour drawing (draw while the canvas is covered). */
(function (root) {
  'use strict';
  function create(wrap, opts) {
    opts = opts || {};
    const canvas = document.createElement('canvas');
    const dpr = Math.min(2, root.devicePixelRatio || 1);
    const size = Math.max(200, Math.floor(wrap.clientWidth || 340));
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = '100%'; canvas.style.aspectRatio = '1';
    canvas.setAttribute('aria-label', 'משטח ציור');
    wrap.appendChild(canvas);
    const blind = document.createElement('div');
    blind.className = 'blind';
    blind.textContent = 'העיניים על המקום, לא על המסך. מציירת בלי להסתכל.';
    blind.hidden = !opts.blind;
    wrap.appendChild(blind);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const strokes = [];
    let current = null;
    let color = opts.color || '#1B1B1F';
    let width = opts.width || 3;

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const sx = size / r.width;
      return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sx };
    }
    function redraw() {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size);
      for (const s of strokes) drawStroke(s);
    }
    function drawStroke(s) {
      if (s.pts.length === 0) return;
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(s.pts[0].x, s.pts[0].y);
      if (s.pts.length === 1) ctx.lineTo(s.pts[0].x + 0.1, s.pts[0].y + 0.1);
      for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i].x, s.pts[i].y);
      ctx.stroke();
    }
    function down(e) {
      if (e.button !== undefined && e.button !== 0) return;
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      current = { color, width, pts: [pos(e)] };
      strokes.push(current);
      drawStroke(current);
      e.preventDefault();
    }
    function move(e) {
      if (!current) return;
      const p = pos(e);
      const last = current.pts[current.pts.length - 1];
      current.pts.push(p);
      ctx.strokeStyle = current.color; ctx.lineWidth = current.width;
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      e.preventDefault();
    }
    function up() { current = null; }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', up);

    return {
      setColor(c) { color = c; },
      setWidth(w) { width = w; },
      setBlind(b) { blind.hidden = !b; },
      undo() { strokes.pop(); redraw(); },
      clear() { strokes.length = 0; redraw(); },
      isEmpty() { return strokes.length === 0; },
      toDataURL() { return canvas.toDataURL('image/png'); },
      destroy() { wrap.innerHTML = ''; },
    };
  }
  root.OTZ_SKETCH = { create };
})(window);
