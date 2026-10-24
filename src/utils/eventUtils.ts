export const normalizeEventCategory = (category: string = ''): string => {
  const cat = category.trim();
  const lower = cat.toLowerCase();
  if (lower === 'fest' || lower === 'party' || lower.includes('fest & party') || lower.includes('party & fest') || lower === 'feste' || lower === 'partys') {
    return 'Fest & Party';
  }
  if (lower === 'wandern' || lower === 'wanderung' || lower === 'wandelen' || lower.includes('wander')) {
    return 'Wandern';
  }
  if (lower === 'neueröffnung' || lower === 'neueröffnungen' || lower === 'eröffnung' || lower === 'opening' || lower === 'grand opening') {
    return 'Neueröffnungen';
  }
  return cat;
};
