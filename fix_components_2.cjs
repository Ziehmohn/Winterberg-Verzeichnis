const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // ensure useTranslation is imported
  if (!content.includes("useTranslation")) {
      content = `import { useTranslation } from '../i18n';\n` + content;
  }

  // just replace the first useState with "const { t } = useTranslation();\n  const [..."
  if (!content.includes("const { t } = useTranslation();")) {
     content = content.replace(/const \[/i, "const { t } = useTranslation();\n  const [");
  }

  fs.writeFileSync(filePath, content);
}

['src/components/Login.tsx', 'src/components/ReviewForm.tsx', 'src/components/SubmitBusiness.tsx'].forEach(fixFile);

