import { categories } from '../src/data.ts';
import { getLegacyCategoryRedirect } from '../src/utils/routes.ts';

const pathname = '/einzelhandel/buerobedarf/k-office-buerodesign';
const redirect = getLegacyCategoryRedirect(pathname, categories);
console.log("Legacy redirect result for", pathname, ":", redirect);
