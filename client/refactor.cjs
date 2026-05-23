const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'src/components/dashboard/DashboardShared.jsx');
const destDir = path.join(__dirname, 'src/components/dashboard/shared');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const content = fs.readFileSync(srcFile, 'utf-8');

const getSection = (name) => {
  const regex = new RegExp(`// ─── ${name} ─+[\\s\\S]*?(?=// ─── |$)`, 'g');
  const match = content.match(regex);
  return match ? match[0] : '';
};

const commonImports = `import { Component, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";
import { SEVERITY_COLOR, STATUS_LABEL } from "../../../constants/ui";
import { getRescueImageUrl } from "../../../utils/imageUrl";

`;

const files = {
  'Badges.jsx': ['SEVERITY BADGE', 'STATUS BADGE', 'SECTION LABEL'],
  'Cards.jsx': ['CARD', 'RESCUE CASE ROW'],
  'Charts.jsx': ['BAR CHART', 'DONUT CHART'],
  'ErrorBoundary.jsx': ['ERROR BOUNDARY'],
  'Header.jsx': ['DASHBOARD HEADER'],
  'Stats.jsx': ['STATS ROW'],
  'ActivityFeed.jsx': ['ACTIVITY FEED'],
  'Notifications.jsx': ['NOTIFICATIONS'],
  'Timeline.jsx': ['TIMELINE'],
  'QuickActions.jsx': ['QUICK ACTIONS'],
  'Modal.jsx': ['MODAL'],
  'Sidebar.jsx': ['SIDEBAR']
};

let indexExports = [];

for (const [filename, sections] of Object.entries(files)) {
  let fileContent = commonImports;
  if (filename === 'Cards.jsx') {
    // RescueCaseRow uses Badges
    fileContent += `import { SeverityBadge, StatusBadge } from "./Badges";\n\n`;
  }
  for (const sec of sections) {
    fileContent += getSection(sec);
  }
  fs.writeFileSync(path.join(destDir, filename), fileContent);
  indexExports.push(`export * from "./${filename.replace('.jsx', '')}";`);
}

fs.writeFileSync(path.join(destDir, 'index.js'), indexExports.join('\n') + '\n');
console.log('Refactoring complete. Created files in', destDir);
