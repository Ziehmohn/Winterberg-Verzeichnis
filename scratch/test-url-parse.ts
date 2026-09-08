import { businesses as initialBusinesses, categories } from '../src/data.ts';
import { findCategoryFromSlug, findSubcategoryFromSlug, slugify } from '../src/utils/routes.ts';

const pathname = '/einzelhandel/buerobedarf/k-office-buerodesign';
const pathParts = pathname.split('/').filter(Boolean);

console.log("pathParts:", pathParts);
const decodedPart1 = decodeURIComponent(pathParts[0]);
console.log("decodedPart1:", decodedPart1);

const catName = findCategoryFromSlug(decodedPart1) || categories.find(c => c.name.toLowerCase() === decodedPart1)?.name;
console.log("catName:", catName);

const catGroup = categories.find(c => c.name === catName);
const decodedPart2 = decodeURIComponent(pathParts[1]);
console.log("decodedPart2:", decodedPart2);

const subName = findSubcategoryFromSlug(decodedPart2) || catGroup?.subcategories.find(s => s.toLowerCase() === decodedPart2.toLowerCase());
console.log("subName:", subName);

const decodedPart3 = decodeURIComponent(pathParts[2]);
console.log("decodedPart3:", decodedPart3);

const matchBusiness = (b: any, rawPart: string) => {
  const cleanPart = slugify(decodeURIComponent(rawPart));
  const bCleanSlug = slugify(b.name);
  const rawPartDecoded = decodeURIComponent(rawPart).toLowerCase();
  const oldRawSlug = b.name.replace(/\s+/g, '-').toLowerCase();
  return bCleanSlug === cleanPart || oldRawSlug === rawPartDecoded || b.id.toLowerCase() === rawPartDecoded;
};

const business = initialBusinesses.find(b => matchBusiness(b, decodedPart3));
console.log("business found:", business ? `${business.id} - ${business.name}` : "NOT FOUND!");
