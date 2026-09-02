const fs = require('fs');

let content = fs.readFileSync('src/data.ts', 'utf8');

// Replace exact substrings for these problematic arrays
content = content.replace(
  "    additionalCategories: [\n      { category: 'Gastronomie', subcategory: 'Cafés' },\n      { category: 'Einzelhandel', subcategory: 'Supermarkt' }\n    ],",
  "    additionalCategories: [\n      { category: 'Gastronomie', subcategory: 'Cafés' }\n    ],"
);
content = content.replace(
  "    additionalCategories: [\n      { category: 'Gastronomie', subcategory: 'Cafés' },\n      { category: 'Einzelhandel', subcategory: 'Supermarkt' }\n    ],",
  "    additionalCategories: [\n      { category: 'Gastronomie', subcategory: 'Cafés' }\n    ],"
);

content = content.replace(
  "    additionalCategories: [\n      { category: 'Ski, Bike & Sport', subcategory: 'Fahrradverleih' },\n      { category: 'Mobilität & KFZ', subcategory: 'KFZ-Werkstätten' }\n    ],",
  "    additionalCategories: [\n      { category: 'Ski, Bike & Sport', subcategory: 'Fahrradverleih' }\n    ],"
);
content = content.replace(
  "    additionalCategories: [\n      { category: 'Ski, Bike & Sport', subcategory: 'Fahrradverleih' },\n      { category: 'Mobilität & KFZ', subcategory: 'KFZ-Werkstätten' }\n    ],",
  "    additionalCategories: [\n      { category: 'Ski, Bike & Sport', subcategory: 'Fahrradverleih' }\n    ],"
);

content = content.replace(
  "    additionalCategories: [\n      { category: 'Ski, Bike & Sport', subcategory: 'Fahrradgeschäfte' },\n      { category: 'Gastronomie', subcategory: 'Restaurant' }\n    ],",
  "    additionalCategories: [\n      { category: 'Ski, Bike & Sport', subcategory: 'Fahrradgeschäfte' }\n    ],"
);

fs.writeFileSync('src/data.ts', content);
console.log('Cleanup complete 2.');
