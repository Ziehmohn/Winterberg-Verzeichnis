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
export function getBusinessRankingBadge(
  business: Business,
  allBusinesses: Business[]
): BusinessRankingBadgeInfo | null {
  // Only Premium businesses receive the official Top Badge
  if (!business.isPremium) return null;

  const approvedReviews = (business.reviews || []).filter(r => !r.status || r.status === 'approved');
  if (approvedReviews.length === 0) return null;

  // Score all businesses
  const scored = allBusinesses.map(b => ({
    ...b,
    score: calculateBusinessRankingScore(b)
  })).sort((a, b) => b.score - a.score);

  // 1. Check Subcategory rank
  let bestRank: number | null = null;
  let categoryName = business.category;
  let targetSubcategory: string | undefined = undefined;
  let isOverall = false;

  if (business.subcategory) {
    const subList = scored.filter(b => b.category === business.category && b.subcategory === business.subcategory);
    const subIdx = subList.findIndex(b => b.id === business.id);
    if (subIdx !== -1 && subIdx < 10) {
      bestRank = subIdx + 1;
      categoryName = business.subcategory;
      targetSubcategory = business.subcategory;
    }
  }

  // 2. Check Category rank if better or if subcategory wasn't top 10
  const catList = scored.filter(b => b.category === business.category);
  const catIdx = catList.findIndex(b => b.id === business.id);
  if (catIdx !== -1 && catIdx < 10) {
    const catRank = catIdx + 1;
    if (bestRank === null || catRank <= bestRank) {
      bestRank = catRank;
      categoryName = business.category;
      targetSubcategory = undefined;
    }
  }

  // 3. Check Overall rank
  const overallIdx = scored.findIndex(b => b.id === business.id);
  if (overallIdx !== -1 && overallIdx < 10) {
    const overallRank = overallIdx + 1;
    if (bestRank === null || overallRank <= bestRank) {
      bestRank = overallRank;
      categoryName = 'Winterberg';
      targetSubcategory = undefined;
      isOverall = true;
    }
  }

  if (bestRank === null || bestRank > 10) return null;

  // Generate target paths
  let targetPathDe = '/die-besten';
  let targetPathNl = '/nl/de-beste';

  if (!isOverall) {
    const catSlugDe = getCategorySlug(business.category, 'de');
    const catSlugNl = getCategorySlug(business.category, 'nl');

    if (targetSubcategory) {
      const subSlugDe = getSubcategorySlug(targetSubcategory, 'de');
      const subSlugNl = getSubcategorySlug(targetSubcategory, 'nl');
      targetPathDe = `/die-besten/${catSlugDe}/${subSlugDe}`;
      targetPathNl = `/nl/de-beste/${catSlugNl}/${subSlugNl}`;
    } else {
      targetPathDe = `/die-besten/${catSlugDe}`;
      targetPathNl = `/nl/de-beste/${catSlugNl}`;
    }
  }

  // Determine Badge Tier:
  // Top 1 = Gold Star Badge
  // Top 3 (ranks 2-3) = Gold Badge
  // Top 5 (ranks 4-5) = Silver Badge
  // Top 10 (ranks 6-10) = Bronze Badge
  if (bestRank === 1) {
    return {
      tier: 'top1_star',
      rank: 1,
      categoryName,
      category: business.category,
      subcategory: targetSubcategory,
      isOverall,
      labelDe: `🌟 Platz 1: ${categoryName}`,
      labelNl: `🌟 Nummer 1: ${categoryName}`,
      subLabelDe: 'Offizielle Bestenliste 2026',
      subLabelNl: 'Officiële ranglijst 2026',
      targetPathDe,
      targetPathNl
    };
  } else if (bestRank <= 3) {
    return {
      tier: 'top3_gold',
      rank: bestRank,
      categoryName,
      category: business.category,
      subcategory: targetSubcategory,
      isOverall,
      labelDe: `🥇 Top 3: ${categoryName}`,
      labelNl: `🥇 Top 3: ${categoryName}`,
      subLabelDe: 'Offizielle Bestenliste 2026',
      subLabelNl: 'Officiële ranglijst 2026',
      targetPathDe,
      targetPathNl
    };
  } else if (bestRank <= 5) {
    return {
      tier: 'top5_silver',
      rank: bestRank,
      categoryName,
      category: business.category,
      subcategory: targetSubcategory,
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
      rank: bestRank,
      categoryName,
      category: business.category,
      subcategory: targetSubcategory,
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
