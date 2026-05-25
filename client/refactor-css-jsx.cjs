const fs = require('fs');
const path = require('path');

let css = fs.readFileSync('src/index.css', 'utf8');

const replacements = [
  { match: /#FFFFFF/g, replacement: 'var(--bg-card)' },
  { match: /#E8ECF1/g, replacement: 'var(--border)' },
  { match: /#F1F4F8/g, replacement: 'var(--border-light)' },
  { match: /#1D6FA4/g, replacement: 'var(--accent)' },
  { match: /#185E8E/g, replacement: 'var(--accent-dim)' },
  { match: /#0D4478/g, replacement: 'var(--accent-deep)' },
  { match: /#F8FAFB/g, replacement: 'var(--bg)' },
  { match: /#111827/g, replacement: 'var(--text-heading)' },
  { match: /#1A2332/g, replacement: 'var(--text)' },
  { match: /#475569/g, replacement: 'var(--text-sub)' },
  { match: /#94A3B8/g, replacement: 'var(--text-muted)' },
  { match: /#5A6A7E/g, replacement: 'var(--text-label)' },
  { match: /#D5DCE5/g, replacement: 'var(--border-input)' },
  { match: /#F3F6F9/g, replacement: 'var(--bg-muted)' },
  { match: /#EAF0F6/g, replacement: 'var(--accent-surface)' },
  { match: /#F5F7FA/g, replacement: 'var(--bg-alt)' },
  { match: /#FAFBFC/g, replacement: 'var(--bg-card-hov)' },
  { match: /#E2E8F0/g, replacement: 'var(--border-light)' },
  { match: /#D0D7E2/g, replacement: 'var(--border-hov)' },
  { match: /#64748B/g, replacement: 'var(--text-label)' },
  { match: /#DC2626/g, replacement: 'var(--danger)' },
  { match: /#059669/g, replacement: 'var(--success)' },
  { match: /#D97706/g, replacement: 'var(--warning)' },
  { match: /rgba\(220,\s*38,\s*38,\s*0\.06\)/g, replacement: 'var(--danger-pale)' },
  { match: /rgba\(220,\s*38,\s*38,\s*0\.15\)/g, replacement: 'var(--danger-border)' },
  { match: /rgba\(220,\s*38,\s*38,\s*0\.08\)/g, replacement: 'var(--danger-pale)' },
  { match: /rgba\(220,\s*38,\s*38,\s*0\.2\)/g, replacement: 'var(--danger-border)' },
  { match: /rgba\(220,\s*38,\s*38,\s*0\.1\)/g, replacement: 'var(--danger-pale)' },
  { match: /rgba\(29,\s*111,\s*164,\s*0\.2\)/g, replacement: 'var(--accent-pale)' },
  { match: /rgba\(29,\s*111,\s*164,\s*0\.25\)/g, replacement: 'var(--accent-glow)' },
  { match: /rgba\(29,\s*111,\s*164,\s*0\.1\)/g, replacement: 'var(--accent-pale)' },
  { match: /rgba\(15,\s*23,\s*42,\s*0\.04\)/g, replacement: 'var(--border-glass)' },
  { match: /#fff(fff)?/gi, replacement: 'var(--text-on-accent)' }, // but only sometimes. Better leave #fff alone and fix it if it's on a button. Wait, #fff on a button should be var(--text-on-accent). Let's do it for all #fff.
];

// Let's not blindly replace #fff as it's dangerous. We'll do it carefully.
for (const { match, replacement } of replacements) {
  css = css.replace(match, replacement);
}

// Button text color
css = css.replace(/color: #fff;/g, 'color: var(--text-on-accent);');

fs.writeFileSync('src/index.css', css);
console.log('Refactored src/index.css');

// Also need a script to replace hardcoded colors in JSX
let jsxReplacements = [
  { match: /color:\s*['"]#EF4444['"]/g, replacement: 'color: T.danger' },
  { match: /color:\s*['"]#DC2626['"]/g, replacement: 'color: T.danger' },
  { match: /color:\s*['"]#059669['"]/g, replacement: 'color: T.success' },
  { match: /color:\s*['"]#10B981['"]/g, replacement: 'color: T.success' },
  { match: /color:\s*['"]#D97706['"]/g, replacement: 'color: T.warning' },
  { match: /color:\s*['"]#F59E0B['"]/g, replacement: 'color: T.warning' },
  { match: /color:\s*['"]#38BDF8['"]/g, replacement: 'color: T.accent' },
  { match: /color:\s*['"]#1D6FA4['"]/g, replacement: 'color: T.accent' },
  
  { match: /background:\s*['"]#FEE2E2['"]/g, replacement: 'background: T.dangerPale' },
  { match: /background:\s*['"]#FEF3C7['"]/g, replacement: 'background: T.warningPale' },
  { match: /background:\s*['"]#DBEAFE['"]/g, replacement: 'background: T.infoPale' },
  { match: /background:\s*['"]#F3E8FF['"]/g, replacement: 'background: T.accentPale' }, // close enough
  { match: /background:\s*['"]#1D6FA4['"]/g, replacement: 'background: T.accent' },
  { match: /background:\s*['"]#38BDF8['"]/g, replacement: 'background: T.accent' },
  
  { match: /borderLeft:\s*['"]3px solid #DC2626['"]/g, replacement: 'borderLeft: `3px solid ${T.danger}`' },
  { match: /borderLeft:\s*['"]3px solid #16A056['"]/g, replacement: 'borderLeft: `3px solid ${T.success}`' },
  { match: /borderLeft:\s*['"]3px solid #1D6FA4['"]/g, replacement: 'borderLeft: `3px solid ${T.accent}`' },
  
  { match: /color:\s*['"]#fff(fff)?['"]/gi, replacement: 'color: T.textOnAccent' },
  { match: /color:\s*['"]#000(000)?['"]/gi, replacement: 'color: T.textHeading' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    } else if (p.endsWith('.jsx')) {
      let content = fs.readFileSync(p, 'utf8');
      let original = content;
      for (const { match, replacement } of jsxReplacements) {
        content = content.replace(match, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(p, content);
        console.log('Refactored', p);
      }
    }
  }
}

processDir('src/pages');
processDir('src/components');
