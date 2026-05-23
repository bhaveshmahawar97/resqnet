const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/dashboard/shared');

const filesImports = {
  'ActivityFeed.jsx': `import { useState } from "react";
import { useT } from "../../../context/ThemeContext";`,
  'Badges.jsx': `import { useT } from "../../../context/ThemeContext";
import { SEVERITY_COLOR, STATUS_LABEL } from "../../../constants/ui";`,
  'Cards.jsx': `import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";
import { getRescueImageUrl } from "../../../utils/imageUrl";`,
  'Charts.jsx': `import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";`,
  'ErrorBoundary.jsx': `import { Component } from "react";`,
  'Header.jsx': `import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";`,
  'Modal.jsx': `import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../../context/ThemeContext";`,
  'Notifications.jsx': `import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";`,
  'QuickActions.jsx': `import { useT } from "../../../context/ThemeContext";`,
  'Sidebar.jsx': `import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";`,
  'Stats.jsx': `import { useT } from "../../../context/ThemeContext";`,
  'Timeline.jsx': `import { useT } from "../../../context/ThemeContext";`
};

const commonImportsBlock = `import { Component, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";
import { SEVERITY_COLOR, STATUS_LABEL } from "../../../constants/ui";
import { getRescueImageUrl } from "../../../utils/imageUrl";

`;

for (const [filename, imports] of Object.entries(filesImports)) {
  const filepath = path.join(dir, filename);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf-8');
    content = content.replace(commonImportsBlock, imports + '\n\n');
    fs.writeFileSync(filepath, content);
  }
}
console.log('Fixed imports in shared components.');
