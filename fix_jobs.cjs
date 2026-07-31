const fs = require('fs');

try {
  let content = fs.readFileSync('src/components/JobsBoard.tsx', 'utf8');

  // Change type rendering in filter buttons
  content = content.replace(
    /\{type\}/g,
    '{t(type)}'
  );

  fs.writeFileSync('src/components/JobsBoard.tsx', content);
} catch (e) {
  console.log(e);
}
