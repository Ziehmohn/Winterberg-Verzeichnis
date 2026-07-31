const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // ensure useTranslation is imported
  if (!content.includes("useTranslation")) {
      content = `import { useTranslation } from '../i18n';\n` + content;
  }

  // add const { t } = useTranslation(); at the beginning of the component
  const match = content.match(/export default function [A-Za-z0-9_]+\([^)]*\)\s*\{/);
  if (match) {
    if (!content.includes("const { t } = useTranslation();")) {
      content = content.replace(match[0], match[0] + "\n  const { t } = useTranslation();\n");
    }
  } else {
    const match2 = content.match(/export function [A-Za-z0-9_]+\([^)]*\)\s*\{/);
    if (match2) {
      if (!content.includes("const { t } = useTranslation();")) {
        content = content.replace(match2[0], match2[0] + "\n  const { t } = useTranslation();\n");
      }
    }
  }

  fs.writeFileSync(filePath, content);
}

['src/components/JobsBoard.tsx', 'src/components/Login.tsx', 'src/components/PricingTable.tsx', 'src/components/ReviewForm.tsx', 'src/components/SubmitBusiness.tsx'].forEach(fixFile);

