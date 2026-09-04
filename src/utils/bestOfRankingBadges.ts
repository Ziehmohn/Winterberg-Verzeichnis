import { Business } from '../types';
import { getCategorySlug, getSubcategorySlug } from './routes';

export type RankingBadgeTier = 'top1_star' | 'top3_gold' | 'top5_silver' | 'top10_bronze';

export interface BusinessRankingBadgeInfo {
  tier: RankingBadgeTier;
  rank: number;
  categoryName: string;
  category: string;
  subcategory?: string;
  isOverall: boolean;
  labelDe: string;
  labelNl: string;
  subLabelDe: string;
  subLabelNl: string;
  targetPathDe: string;
  targetPathNl: string;
}

/**
 * Calculates Bayesian ranking score for any business
 */
export function calculateBusinessRankingScore(b: Business): number {
  const approvedReviews = (b.reviews || []).filter(r => !r.status || r.status === 'approved');
  const count = approvedReviews.length;
  if (count === 0) {
    return b.isVerified ? 1.5 : 1.0;
  }
  const avg = approvedReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / count;
  const priorRating = 4.6;
  const priorWeight = 2;
  return (avg * count + priorRating * priorWeight) / (count + priorWeight);
}

/**
 * Calculates the best rank achieved by a premium business across:
 * 1. Subcategory (e.g., "Restaurants")
 * 2. Main Category (e.g., "Gastronomie")
 * 3. Overall Winterberg
 */
/**
 * Helper to build a badge object for a specific rank and category
 */
function createBadgeInfo(
  rank: number,
  categoryName: string,
  category: string,
  subcategory: string | undefined,
  isOverall: boolean
): BusinessRankingBadgeInfo {
  let targetPathDe = '/die-besten';
  let targetPathNl = '/nl/de-beste';

  if (!isOverall) {
    const catSlugDe = getCategorySlug(category, 'de');
    const catSlugNl = getCategorySlug(category, 'nl');

    if (subcategory) {
      const subSlugDe = getSubcategorySlug(subcategory, 'de');
      const subSlugNl = getSubcategorySlug(subcategory, 'nl');
      targetPathDe = `/die-besten/${catSlugDe}/${subSlugDe}`;
      targetPathNl = `/nl/de-beste/${catSlugNl}/${subSlugNl}`;
    } else {
      targetPathDe = `/die-besten/${catSlugDe}`;
      targetPathNl = `/nl/de-beste/${catSlugNl}`;
    }
  }

  if (rank === 1) {
    return {
      tier: 'top1_star',
      rank: 1,
      categoryName,
      category,
      subcategory,
      isOverall,
      labelDe: `🌟 Platz 1: ${categoryName}`,
      labelNl: `🌟 Nummer 1: ${categoryName}`,
      subLabelDe: 'Offizielle Bestenliste 2026',
      subLabelNl: 'Officiële ranglijst 2026',
      targetPathDe,
      targetPathNl
    };
  } else if (rank <= 3) {
    return {
      tier: 'top3_gold',
      rank,
      categoryName,
      category,
      subcategory,
      isOverall,
      labelDe: `🥇 Top 3: ${categoryName}`,
      labelNl: `🥇 Top 3: ${categoryName}`,
      subLabelDe: 'Offizielle Bestenliste 2026',
      subLabelNl: 'Officiële ranglijst 2026',
      targetPathDe,
      targetPathNl
    };
  } else if (rank <= 5) {
    return {
      tier: 'top5_silver',
      rank,
      categoryName,
      category,
      subcategory,
      isOverall,
      labelDe: `🥈 Top 5: ${categoryName}`,
      labelNl: `🥈 Top 5: ${categoryName}`,
      subLabelDe: 'Offizielle Bestenliste 2026',
      subLabelNl: 'Officiële ranglijst 2026',
      targetPathDe,
      targetPathNl
    };
  } else {
    return {
      tier: 'top10_bronze',
      rank,
      categoryName,
      category,
      subcategory,
      isOverall,
      labelDe: `🥉 Top 10: ${categoryName}`,
      labelNl: `🥉 Top 10: ${categoryName}`,
      subLabelDe: 'Offizielle Bestenliste 2026',
      subLabelNl: 'Officiële ranglijst 2026',
      targetPathDe,
      targetPathNl
    };
  }
}

/**
 * Returns all ranking badges for a business.
 * If a business is Rank 1 in multiple categories/subcategories,
 * all Rank 1 badges are returned!
 */
export function getBusinessRankingBadges(
  business: Business,
  allBusinesses: Business[]
): BusinessRankingBadgeInfo[] {
  if (!business.isPremium) return [];

  const approvedReviews = (business.reviews || []).filter(r => !r.status || r.status === 'approved');
  if (approvedReviews.length === 0) return [];

  // Score all businesses
  const scored = allBusinesses.map(b => ({
    ...b,
    score: calculateBusinessRankingScore(b)
  })).sort((a, b) => b.score - a.score);

  const candidateCategories: { category: string; subcategory?: string; name: string }[] = [];

  // Primary subcategory
  if (business.subcategory) {
    candidateCategories.push({
      category: business.category,
      subcategory: business.subcategory,
      name: business.subcategory
    });
  }

  // Primary main category
  candidateCategories.push({
    category: business.category,
    subcategory: undefined,
    name: business.category
  });

  // Additional categories
  if (Array.isArray(business.additionalCategories)) {
    business.additionalCategories.forEach(ac => {
      if (ac.subcategory) {
        candidateCategories.push({
          category: ac.category,
          subcategory: ac.subcategory,
          name: ac.subcategory
        });
      }
      if (ac.category) {
        candidateCategories.push({
          category: ac.category,
          subcategory: undefined,
          name: ac.category
        });
      }
    });
  }

  // De-duplicate candidate categories
  const seenKeys = new Set<string>();
  const uniqueCandidates = candidateCategories.filter(c => {
    const key = `${c.category}::${c.subcategory || ''}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  const badges: BusinessRankingBadgeInfo[] = [];

  // 1. Check every category for Platz 1
  for (const cand of uniqueCandidates) {
    let list: typeof scored;
    if (cand.subcategory) {
      list = scored.filter(b => 
        (b.category === cand.category && b.subcategory === cand.subcategory) ||
        b.additionalCategories?.some(ac => ac.category === cand.category && ac.subcategory === cand.subcategory)
      );
    } else {
      list = scored.filter(b => 
        b.category === cand.category || 
        b.additionalCategories?.some(ac => ac.category === cand.category)
      );
    }

    const idx = list.findIndex(b => b.id === business.id);
    if (idx === 0) { // Rank 1!
      badges.push(createBadgeInfo(1, cand.name, cand.category, cand.subcategory, false));
    }
  }

  // Check Overall Winterberg rank for Platz 1
  const overallIdx = scored.findIndex(b => b.id === business.id);
  if (overallIdx === 0) {
    badges.unshift(createBadgeInfo(1, 'Winterberg', 'Alle', undefined, true));
  }

  // If the business has at least one Platz 1 badge, return all Platz 1 badges!
  if (badges.length > 0) {
    return badges;
  }

  // 2. Fallback: If not Platz 1 anywhere, return the single best rank achieved (Top 3, Top 5, Top 10)
  let bestRank: number | null = null;
  let bestBadge: BusinessRankingBadgeInfo | null = null;

  for (const cand of uniqueCandidates) {
    let list: typeof scored;
    if (cand.subcategory) {
      list = scored.filter(b => 
        (b.category === cand.category && b.subcategory === cand.subcategory) ||
        b.additionalCategories?.some(ac => ac.category === cand.category && ac.subcategory === cand.subcategory)
      );
    } else {
      list = scored.filter(b => 
        b.category === cand.category || 
        b.additionalCategories?.some(ac => ac.category === cand.category)
      );
    }

    const idx = list.findIndex(b => b.id === business.id);
    if (idx !== -1 && idx < 10) {
      const rank = idx + 1;
      if (bestRank === null || rank < bestRank) {
        bestRank = rank;
        bestBadge = createBadgeInfo(rank, cand.name, cand.category, cand.subcategory, false);
      }
    }
  }

  if (overallIdx !== -1 && overallIdx < 10) {
    const overallRank = overallIdx + 1;
    if (bestRank === null || overallRank < bestRank) {
      bestBadge = createBadgeInfo(overallRank, 'Winterberg', 'Alle', undefined, true);
    }
  }

  return bestBadge ? [bestBadge] : [];
}

/**
 * Backward compatibility: returns the first/best badge
 */
export function getBusinessRankingBadge(
  business: Business,
  allBusinesses: Business[]
): BusinessRankingBadgeInfo | null {
  const badges = getBusinessRankingBadges(business, allBusinesses);
  return badges[0] || null;
}
