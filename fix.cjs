const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The faulty lines look like:
// href={getPath(`/${encodeURIComponent(group.name)}`}
// href={getPath(`/${encodeURIComponent(group.name)}/${encodeURIComponent(sub)}`}

content = content.replace(/href=\{getPath\((.*?)\}\s*onClick/g, 'href={getPath($1)} onClick');
content = content.replace(/href=\{getPath\((.*?)\}\s*key/g, 'href={getPath($1)} key');
// for line 777: href={getPath(`/${encodeURIComponent(bus.category)}${bus.subcategory ? `/${encodeURIComponent(bus.subcategory)}` : ''}/${encodeURIComponent(bus.name.replace(/\s+/g, '-').toLowerCase())}`}
content = content.replace(/href=\{getPath\((.*?)\}\s*onClick/g, 'href={getPath($1)} onClick');

fs.writeFileSync('src/App.tsx', content);
