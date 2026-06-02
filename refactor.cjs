const fs = require('fs');
const path = require('path');

const uiComponents = ['Badge', 'Button', 'Card', 'FilterTabs', 'Skeleton'];
const uiDir = path.join(__dirname, 'src', 'components', 'ui');

for (const comp of uiComponents) {
  const compDir = path.join(uiDir, comp);
  if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
  }
  
  const tsxPath = path.join(uiDir, `${comp}.tsx`);
  const cssPath = path.join(uiDir, `${comp}.module.css`);
  
  if (fs.existsSync(tsxPath)) {
    fs.renameSync(tsxPath, path.join(compDir, `${comp}.tsx`));
  }
  if (fs.existsSync(cssPath)) {
    fs.renameSync(cssPath, path.join(compDir, `${comp}.module.css`));
  }
  
  fs.writeFileSync(path.join(compDir, 'index.ts'), `export { default } from './${comp}';\n`);
}

const cardComponents = ['PostCard', 'StatCard'];
const cardsDir = path.join(__dirname, 'src', 'components', 'cards');

for (const comp of cardComponents) {
  const compDir = path.join(cardsDir, comp);
  if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
  }
  
  const tsxPath = path.join(cardsDir, `${comp}.tsx`);
  const cssPath = path.join(cardsDir, `${comp}.module.css`);
  
  if (fs.existsSync(tsxPath)) {
    fs.renameSync(tsxPath, path.join(compDir, `${comp}.tsx`));
  }
  if (fs.existsSync(cssPath)) {
    fs.renameSync(cssPath, path.join(compDir, `${comp}.module.css`));
  }
  
  fs.writeFileSync(path.join(compDir, 'index.ts'), `export { default } from './${comp}';\n`);
}

console.log('Refactor complete!');
