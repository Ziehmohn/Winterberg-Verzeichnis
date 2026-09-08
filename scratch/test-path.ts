import { businesses } from '../src/data.ts';
import { getBusinessPath } from '../src/utils/routes.ts';

const b = businesses.find(b => b.id === '106');
console.log("getBusinessPath(de):", getBusinessPath(b!, 'de'));
console.log("getBusinessPath(nl):", getBusinessPath(b!, 'nl'));
