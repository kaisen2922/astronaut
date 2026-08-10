/* ASTRA shared scripts */
(function(){
  // UTC clock
  function tickClock(){
    const el = document.querySelector('[data-clock]');
    if(!el) return;
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    el.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
  }
  tickClock(); setInterval(tickClock,1000);

  // Mission elapsed (T+)
  const start = Date.now();
  function tickMission(){
    const el = document.querySelector('[data-mission-time]');
    if(!el) return;
    const s = Math.floor((Date.now()-start)/1000) + 3600*72; // start at T+72h
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    const p = n => String(n).padStart(2,'0');
    el.textContent = `${String(h).padStart(3,'0')}:${p(m)}:${p(sec)}`;
  }
  tickMission(); setInterval(tickMission,1000);

  // Active nav highlight
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  // Spectrum bars (random heights)
  document.querySelectorAll('.spectrum').forEach(s=>{
    if(s.children.length) return;
    for(let i=0;i<14;i++){
      const b = document.createElement('span');
      b.style.height = (30 + Math.random()*70)+'%';
      b.style.animationDelay = (i*0.08)+'s';
      s.appendChild(b);
    }
  });
  document.querySelectorAll('.voice').forEach(s=>{
    if(s.children.length) return;
    for(let i=0;i<32;i++){
      const b = document.createElement('span');
      b.style.height = (10 + Math.random()*70)+'%';
      b.style.animationDelay = (i*0.04)+'s';
      s.appendChild(b);
    }
  });

  // Line chart on canvas
  function drawChart(canvas, series){
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w*dpr; canvas.height = h*dpr; ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,w,h);
    // grid
    ctx.strokeStyle = 'rgba(100,116,139,.12)'; ctx.lineWidth = 1;
    for(let i=1;i<4;i++){const y=(h/4)*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();}
    series.forEach(s=>{
      const max = Math.max(...s.data), min = Math.min(...s.data);
      const range = (max-min)||1;
      ctx.beginPath();
      s.data.forEach((v,i)=>{
        const x = (w/(s.data.length-1))*i;
        const y = h - ((v-min)/range)*h*0.85 - 8;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      // area
      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0, s.color+'55'); grad.addColorStop(1, s.color+'00');
      ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      // line
      ctx.beginPath();
      s.data.forEach((v,i)=>{
        const x = (w/(s.data.length-1))*i;
        const y = h - ((v-min)/range)*h*0.85 - 8;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.stroke();
    });
  }
  window.drawChart = drawChart;

  // Auto-init charts
  document.querySelectorAll('canvas[data-chart]').forEach(c=>{
    const series = JSON.parse(c.getAttribute('data-chart'));
    const render = ()=> drawChart(c, series);
    render(); window.addEventListener('resize', render);
  });

  // Animate progress bars from data-fill
  document.querySelectorAll('.bar > i').forEach(i=>{
    const w = i.getAttribute('data-fill') || '60%';
    requestAnimationFrame(()=>{ i.style.width = w; });
  });
})();
