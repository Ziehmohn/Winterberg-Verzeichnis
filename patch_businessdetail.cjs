const fs = require('fs');
let bd = fs.readFileSync('src/components/BusinessDetail.tsx', 'utf8');

bd = bd.replace(
  "{business.extendedDescription.split('\\n').map((paragraph, i) => (\n                    <p key={i} className=\"mb-4 text-black/80\">{paragraph}</p>\n                  ))}",
  "<div dangerouslySetInnerHTML={{ __html: business.extendedDescription }} />"
);

fs.writeFileSync('src/components/BusinessDetail.tsx', bd);
