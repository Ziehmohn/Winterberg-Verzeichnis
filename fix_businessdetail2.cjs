const fs = require('fs');
let content = fs.readFileSync('src/components/BusinessDetail.tsx', 'utf8');

content = content.replace(
  "day === 'monday' ? 'Montag' :",
  "day === 'monday' ? t('monday') :"
);
content = content.replace(
  "day === 'tuesday' ? 'Dienstag' :",
  "day === 'tuesday' ? t('tuesday') :"
);
content = content.replace(
  "day === 'wednesday' ? 'Mittwoch' :",
  "day === 'wednesday' ? t('wednesday') :"
);
content = content.replace(
  "day === 'thursday' ? 'Donnerstag' :",
  "day === 'thursday' ? t('thursday') :"
);
content = content.replace(
  "day === 'friday' ? 'Freitag' :",
  "day === 'friday' ? t('friday') :"
);
content = content.replace(
  "day === 'saturday' ? 'Samstag' : 'Sonntag'",
  "day === 'saturday' ? t('saturday') : t('sunday')"
);

fs.writeFileSync('src/components/BusinessDetail.tsx', content);
