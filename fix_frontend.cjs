const fs = require('fs');
const files = [
  'src/components/dashboard/SearchTrafficCard/SearchTrafficCard.tsx',
  'src/components/dashboard/TopPostsList/TopPostsList.tsx'
];

files.forEach(file => {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/\\\`/g, '\`').replace(/\\\$\\\{/g, '\$\{');
  fs.writeFileSync(file, text);
});
console.log('Fixed backticks and interpolation');
