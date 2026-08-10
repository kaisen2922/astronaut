/* Games page interactivity */
(function(){
  // Memory match
  const grid = document.getElementById('mem-grid');
  if(grid){
    const symbols = ['🚀','🌕','🛰️','👨‍🚀','⭐','🪐','☄️','🌌'];
    let deck = [...symbols, ...symbols].sort(()=>Math.random()-.5);
    let first=null, lock=false, matches=0;
    const score = document.getElementById('mem-score');
    deck.forEach(sym=>{
      const t = document.createElement('div');
      t.className='mem-tile';
      t.innerHTML = `<span class="face">${sym}</span>`;
      t.dataset.sym = sym;
      t.addEventListener('click',()=>{
        if(lock || t.classList.contains('matched') || t.classList.contains('flipped')) return;
        t.classList.add('flipped');
        if(!first){ first = t; return; }
        if(first.dataset.sym === t.dataset.sym){
          first.classList.add('matched'); t.classList.add('matched');
          first=null; matches++;
          if(score) score.textContent = matches+' / 8';
        }else{
          lock=true;
          setTimeout(()=>{ first.classList.remove('flipped'); t.classList.remove('flipped'); first=null; lock=false; },700);
        }
      });
      grid.appendChild(t);
    });
  }

  // Breathing instruction
  const breath = document.querySelector('.breath-circle');
  if(breath){
    let phase=0; const phases=['INHALE','HOLD','EXHALE','HOLD'];
    breath.textContent = phases[0];
    setInterval(()=>{ phase=(phase+1)%4; breath.textContent = phases[phase]; }, 2000);
  }

  // Quick mood log
  document.querySelectorAll('[data-mood]').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('[data-mood]').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const out = document.getElementById('mood-out');
      if(out) out.textContent = 'Logged: '+b.dataset.mood;
    });
  });
})();
