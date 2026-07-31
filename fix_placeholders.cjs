const fs = require('fs');

// src/components/PricingTable.tsx
let pricing = fs.readFileSync('src/components/PricingTable.tsx', 'utf8');
pricing = pricing.replace(/'"\+t\("monthlyCancelable"\)\+"'/g, 't("monthlyCancelable")'); // replace '"+t("...")+"'
fs.writeFileSync('src/components/PricingTable.tsx', pricing);

// src/components/SubmitBusiness.tsx
let submit = fs.readFileSync('src/components/SubmitBusiness.tsx', 'utf8');
submit = submit.replace(/'"\+t\("errorOccurred"\)\+"'/g, 't("errorOccurred")'); // alert('"+t("errorOccurred")+"'); -> alert(t("errorOccurred"));
submit = submit.replace(/'\{t\("bookPaid"\)\}'/g, 't("bookPaid")');
submit = submit.replace(/'\{t\("createEntry"\)\}'/g, 't("createEntry")');
fs.writeFileSync('src/components/SubmitBusiness.tsx', submit);

// src/App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/'\{t\("activateLightTheme"\)\}'/g, 't("activateLightTheme")');
app = app.replace(/'\{t\("darkTheme"\)\}'/g, 't("darkTheme")');
app = app.replace(/'\{t\("saving"\)\}'/g, 't("saving")');
app = app.replace(/'\{t\("saveEntry"\)\}'/g, 't("saveEntry")');
fs.writeFileSync('src/App.tsx', app);
