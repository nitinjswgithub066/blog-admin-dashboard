const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const dataDir = path.join(srcDir, 'data');

// 1. Rename files
const renames = [
  { old: 'mockCategories.ts', new: 'categoriesData.ts' },
  { old: 'mockPosts.ts', new: 'postsData.ts' },
  { old: 'mockDashboard.ts', new: 'dashboardData.ts' }
];

renames.forEach(r => {
  const oldPath = path.join(dataDir, r.old);
  const newPath = path.join(dataDir, r.new);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
});

// 2. Split mockSettings.ts
const mockSettingsPath = path.join(dataDir, 'mockSettings.ts');
if (fs.existsSync(mockSettingsPath)) {
  const content = fs.readFileSync(mockSettingsPath, 'utf8');
  
  // Extract profile data
  const profileMatch = content.match(/export const mockAdminProfile.*?};/s);
  if (profileMatch) {
    fs.writeFileSync(path.join(dataDir, 'profileData.ts'), `import type { AdminProfile } from '../types';\n\n${profileMatch[0]}\n`);
  }
  
  // Extract settings data
  const settingsMatch = content.match(/export const mockSiteSettings.*?};/s);
  if (settingsMatch) {
    fs.writeFileSync(path.join(dataDir, 'settingsData.ts'), `import type { SiteSettings } from '../types';\n\n${settingsMatch[0]}\n`);
  }
  
  // Delete mockSettings.ts
  fs.unlinkSync(mockSettingsPath);
}

// 3. Fix imports in Dashboard widgets
const updateImports = (filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/mockDashboard/g, 'dashboardData');
    fs.writeFileSync(filePath, content);
  }
}

updateImports(path.join(srcDir, 'components', 'dashboard', 'SearchTrafficCard', 'SearchTrafficCard.tsx'));
updateImports(path.join(srcDir, 'components', 'dashboard', 'PerformanceChart', 'PerformanceChart.tsx'));

console.log('Data refactor complete!');
