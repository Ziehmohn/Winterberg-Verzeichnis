import { Business, Job, Review } from '../types';
import { getBusinessPath, getCategorySlug, getSubcategorySlug } from './routes';

const BASE_URL = 'https://winterberg-verzeichnis.de';

/**
 * Maps Winterberg category names to official Schema.org LocalBusiness types
 */
export function getSchemaLocalBusinessType(category = '', subcategory = ''): string {
  const normCat = category.toLowerCase();
  const normSub = subcategory.toLowerCase();

  if (normSub.includes('restaurant') || normCat.includes('gastro')) return 'Restaurant';
  if (normSub.includes('café') || normSub.includes('cafe') || normSub.includes('bäckerei')) return 'CafeOrCoffeeShop';
  if (normSub.includes('bar') || normSub.includes('kneipe') || normSub.includes('pub')) return 'BarOrPub';
  if (normSub.includes('hotel') || normCat.includes('hotel') || normCat.includes('unterk')) return 'LodgingBusiness';
  if (normSub.includes('supermarkt') || normCat.includes('einzelhandel')) return 'Store';
  if (normSub.includes('kfz') || normSub.includes('werkstatt')) return 'AutoRepair';
  if (normSub.includes('tankstelle')) return 'GasStation';
  if (normSub.includes('arzt') || normSub.includes('praxis') || normCat.includes('gesund') || normCat.includes('mediz')) return 'MedicalBusiness';
  if (normSub.includes('zahnarzt')) return 'Dentist';
  if (normSub.includes('apotheke')) return 'Pharmacy';
  if (normSub.includes('bank') || normSub.includes('finanz')) return 'FinancialService';
  if (normSub.includes('anwalt') || normSub.includes('rechtsanw')) return 'LegalService';
  if (normSub.includes('immobilien')) return 'RealEstateAgent';
  if (normSub.includes('friseur') || normSub.includes('kosmetik') || normSub.includes('beauty')) return 'BeautySalon';
  if (normCat.includes('handwerk')) return 'HomeAndConstructionBusiness';
  if (normCat.includes('sport') || normCat.includes('ski') || normCat.includes('bike')) return 'SportsActivityLocation';

  return 'LocalBusiness';
}

/**
 * Converts German opening hours string (e.g. "08:00 - 17:00") to Schema.org OpeningHoursSpecification
 */
function parseOpeningHours(openingHours?: any): any[] {
  if (!openingHours || typeof openingHours !== 'object') return [];

  const dayMap: Record<string, string> = {
    monday: 'https://schema.org/Monday',
    tuesday: 'https://schema.org/Tuesday',
    wednesday: 'https://schema.org/Wednesday',
    thursday: 'https://schema.org/Thursday',
    friday: 'https://schema.org/Friday',
    saturday: 'https://schema.org/Saturday',
    sunday: 'https://schema.org/Sunday'
  };

  const specs: any[] = [];

  Object.entries(dayMap).forEach(([dayKey, dayUrl]) => {
    const timeStr = openingHours[dayKey];
    if (typeof timeStr === 'string' && timeStr.includes('-') && !timeStr.toLowerCase().includes('geschlossen')) {
      const parts = timeStr.split('-').map(s => s.trim());
      if (parts.length === 2) {
        specs.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: dayUrl,
          opens: parts[0],
          closes: parts[1]
        });
      }
    }
  });

  return specs;
}

/**
 * Generates Schema.org LocalBusiness with OpeningHours, AggregateRating, and Reviews
 */
export function generateLocalBusinessSchema(business: Business, lang: 'de' | 'nl' = 'de'): any {
  const businessUrl = `${BASE_URL}${getBusinessPath(business, lang)}`;
  const schemaType = getSchemaLocalBusinessType(business.category, business.subcategory);

  const approvedReviews = Array.isArray(business.reviews) 
    ? business.reviews.filter(r => !r.status || r.status === 'approved')
    : [];

  const reviewCount = approvedReviews.length;
  const avgRating = reviewCount > 0 
    ? (approvedReviews.reduce((sum, r) => sum + (Number(r?.rating) || 5), 0) / reviewCount).toFixed(1)
    : null;

  const image = business.headerImage || 
                business.uploadedImage || 
                business.imageLink || 
                (Array.isArray(business.gallery) && business.gallery[0]) || 
                `${BASE_URL}/winterberg-header.webp`;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': businessUrl,
    name: business.name,
    description: business.description,
    url: business.website || businessUrl,
    image,
    telephone: business.phone || undefined,
    email: business.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.district || 'Winterberg',
      postalCode: '59955',
      addressCountry: 'DE'
    }
  };

  if (business.logoUrl) {
    schema.logo = business.logoUrl.startsWith('http') ? business.logoUrl : `${BASE_URL}${business.logoUrl}`;
  }

  if (business.coordinates && business.coordinates.lat && business.coordinates.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.coordinates.lat,
      longitude: business.coordinates.lng
    };
  }

  const openingHoursSpecs = parseOpeningHours(business.openingHours);
  if (openingHoursSpecs.length > 0) {
    schema.openingHoursSpecification = openingHoursSpecs;
  }

  // AggregateRating
  if (avgRating && reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1'
    };
  }

  // Individual Reviews
  if (approvedReviews.length > 0) {
    schema.review = approvedReviews.slice(0, 10).map((rev) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.authorName || 'Kunde aus Winterberg'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Number(rev.rating) || 5,
        bestRating: '5',
        worstRating: '1'
      },
      reviewBody: rev.text,
      datePublished: rev.date ? new Date(rev.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  }

  return schema;
}

/**
 * Generates CollectionPage Schema for Category / Subcategory listings
 */
export function generateCollectionPageSchema(
  categoryName: string,
  subcategoryName: string | undefined,
  businesses: Business[],
  lang: 'de' | 'nl' = 'de'
): any {
  const title = subcategoryName ? `${subcategoryName} in Winterberg` : `${categoryName} in Winterberg`;
  const catSlug = getCategorySlug(categoryName, lang);
  const subSlug = subcategoryName ? getSubcategorySlug(subcategoryName, lang) : '';
  const pageUrl = `${BASE_URL}/${catSlug}${subSlug ? `/${subSlug}` : ''}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageUrl,
    name: title,
    description: `Übersicht aller ${businesses.length} empfohlenen Betriebe in ${title} mit Adressen, Öffnungszeiten und Bewertungen.`,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: businesses.length,
      itemListElement: businesses.slice(0, 25).map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        url: `${BASE_URL}${getBusinessPath(b, lang)}`
      }))
    }
  };
}

/**
 * Generates ItemList Schema for Bestenlisten (Rankings)
 */
export function generateItemListSchema(
  rankingTitle: string,
  businesses: Business[],
  canonicalUrl: string,
  lang: 'de' | 'nl' = 'de'
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': canonicalUrl,
    name: rankingTitle,
    description: `Die besten Betriebe in Winterberg – Offizielle Bestenliste und Rangliste 2026.`,
    url: canonicalUrl,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': getSchemaLocalBusinessType(b.category, b.subcategory),
        name: b.name,
        url: `${BASE_URL}${getBusinessPath(b, lang)}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: b.address,
          addressLocality: b.district || 'Winterberg',
          postalCode: '59955',
          addressCountry: 'DE'
        }
      }
    }))
  };
}

/**
 * Generates BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * Generates JobPosting Schema for Job board ads
 */
export function generateJobPostingSchema(job: Job, business?: Business): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    employmentType: job.type === 'Vollzeit' ? 'FULL_TIME' : job.type === 'Teilzeit' ? 'PART_TIME' : job.type === 'Minijob' ? 'PART_TIME' : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: business?.name || 'Unternehmen in Winterberg',
      sameAs: business?.website || undefined
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: business?.address || 'Winterberg',
        addressLocality: business?.district || 'Winterberg',
        postalCode: '59955',
        addressCountry: 'DE'
      }
    }
  };
}

/**
 * Generates WebSite SearchAction Schema for Google Sitelinks Search Box
 */
export function generateWebSiteSearchSchema(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Das Winterberg Verzeichnis',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/alle-unternehmen?suche={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}
