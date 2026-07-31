const fs = require('fs');
let content = fs.readFileSync('src/components/DirectoryMap.tsx', 'utf8');

if (!content.includes('useTranslation')) {
  content = content.replace(
    "import { isOpenNow } from '../utils';",
    "import { isOpenNow } from '../utils';\nimport { useTranslation } from '../i18n';"
  );
}

// In GeocodedMarker: const GeocodedMarker: React.FC...
content = content.replace(
  /const GeocodedMarker: React\.FC<\{[^}]+\}> = \(\{ bus, onClick, onPopupClick \}\) => \{/,
  `$&
  const { t } = useTranslation();`
);

content = content.replace(
  /const openState = isOpenNow\(bus.openingHours\);/,
  "const openState = isOpenNow(bus.openingHours, t);"
);

content = content.replace(
  /title="Verifiziertes Unternehmen"/,
  'title={t("verifiedBusiness") || "Verifiziertes Unternehmen"}'
);

fs.writeFileSync('src/components/DirectoryMap.tsx', content);
