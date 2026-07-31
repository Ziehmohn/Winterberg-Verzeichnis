const fs = require('fs');

const files = ['src/components/JobsBoard.tsx', 'src/components/Login.tsx', 'src/components/PricingTable.tsx', 'src/components/ReviewForm.tsx', 'src/components/SubmitBusiness.tsx'];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const matches = content.match(/t\(".*?"\)/g);
    console.log(f, matches);
});
