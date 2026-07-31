const fs = require('fs');

function patchFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');

  // ensure `const { t } = useTranslation();` exists inside the function body
  if (!content.includes("const { t } = useTranslation();")) {
      content = content.replace(/(export default function [a-zA-Z0-9_]+\([^)]*\)\s*\{)/, "$1\n  const { t } = useTranslation();");
      content = content.replace(/(export function [a-zA-Z0-9_]+\([^)]*\)\s*\{)/, "$1\n  const { t } = useTranslation();");
      content = content.replace(/(const [a-zA-Z0-9_]+ = \([^)]*\) =>\s*\{)/, "$1\n  const { t } = useTranslation();");
  }

  fs.writeFileSync(filepath, content);
}

['src/components/JobsBoard.tsx', 'src/components/Login.tsx', 'src/components/PricingTable.tsx', 'src/components/ReviewForm.tsx', 'src/components/SubmitBusiness.tsx'].forEach(patchFile);
