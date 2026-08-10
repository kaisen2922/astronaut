const fs = require('fs');

const files = ['index.html', 'wellness.html', 'games.html', 'profile.html'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('memories.html')) {
    // Inject into nav-tabs
    content = content.replace(
      /<a data-nav(?: class="active")? href="profile\.html">PROFILE<\/a>\s*<\/div>/g,
      match => match.replace('</div>', '  <a data-nav href="memories.html">MEMORIES</a>\n    </div>')
    );

    // Inject into sidebar
    // We match the PROFILE side-link
    const profileRegex = /<a class="side-link(?: active)?" href="profile\.html">[\s\S]*?<span class="lbl-text">PROFILE<\/span>\s*<\/a>/;
    const memoriesSidebar = `\n      <a class="side-link" href="memories.html">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>\n        <span class="lbl-text">MEMORIES</span>\n      </a>`;
    
    content = content.replace(profileRegex, match => match + memoriesSidebar);
  }

  // Make the connect button functional in index.html
  if (file === 'index.html') {
    content = content.replace(
      '<button class="btn">CONNECT_WITH_LOVED_ONES</button>', 
      '<button class="btn" onclick="window.location.href=\'memories.html\'">CONNECT_WITH_LOVED_ONES</button>'
    );
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
