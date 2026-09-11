/** Regional Ghana culture photography: Ga, Ewe, Northern, Fante (no kente-focused assets). */
export const cultureImages = {
  hero: '/images/gallery/hero-multicultural.jpg',
  officialBanner: '/images/Banner.jpeg',
  kwameNkrumahStatue: '/images/gallery/hero-carousel-nkrumah-park-ai-mobile-1600x900.webp',
  akan: '/images/gallery/traditional-dance.jpg',
  ga: '/images/gallery/ga-culture.jpg',
  ewe: '/images/gallery/ewe-culture.jpg',
  northern: '/images/gallery/northern-culture.jpg',
  fante: '/images/gallery/fante-culture.jpg',
  marketplace: '/images/gallery/marketplace-regional.jpg',
  family: '/images/gallery/family-cultural.jpg',
  food: '/images/gallery/ghana-celebration-meal.jpg',
  music: '/images/gallery/music-regional.jpg',
  welcomeCommunity: '/images/gallery/welcome-carousel-ghanaian-community-2560x1440.webp',
  welcomeDrummers: '/images/gallery/welcome-carousel-ghanaian-drummers-2560x1440.webp',
  independenceSquare: '/images/gallery/hero-carousel-black-star-square-ai-mobile-1600x900.webp',
  /** Desktop 24:7 art, composed from independenceSquare (same photograph). */
  independenceSquareDesktop: '/images/gallery/hero-carousel-black-star-square-ai-4800x1400.webp',
  flagstaffHouse: '/images/gallery/hero-carousel-flagstaff-house-ai-mobile-1600x900.webp',
  /** Desktop 24:7 art, full-height scene from flagstaffHouse (same photograph). */
  flagstaffHouseDesktop: '/images/gallery/hero-carousel-flagstaff-house-ai-4800x1400.webp',
  /** Desktop 24:7 art, full-height scene from kwameNkrumahStatue (same photograph). */
  kwameNkrumahStatueDesktop: '/images/gallery/hero-carousel-nkrumah-park-ai-4800x1400.webp',
} as const;

/** Standardized desktop carousel art (24:7). */
export const homeCarouselDesktopImages = {
  nkrumahStatue: cultureImages.kwameNkrumahStatueDesktop,
  independenceMonument: cultureImages.independenceSquareDesktop,
  jubileeHouse: cultureImages.flagstaffHouseDesktop,
} as const;

/** Background slides for the hero (home screen). */
export const homeCarouselSlides = [
  {
    id: 'official-banner',
    mobileImage: cultureImages.officialBanner,
    desktopImage: cultureImages.officialBanner,
    alt: 'Official Ghana Day in Tampa Bay GhanaFest Florida 2026 program banner',
    objectPositionMobile: '50% 50%',
  },
  {
    id: 'nkrumah-statue',
    mobileImage: cultureImages.kwameNkrumahStatue,
    desktopImage: cultureImages.kwameNkrumahStatueDesktop,
    alt: 'Bronze statue of Kwame Nkrumah at the Kwame Nkrumah Memorial Park in Accra, Ghana',
    objectPositionMobile: '50% 50%',
  },
  {
    id: 'independence-square',
    mobileImage: cultureImages.independenceSquare,
    desktopImage: cultureImages.independenceSquareDesktop,
    alt: 'Independence Square and Black Star Arch in Accra, Ghana',
    objectPositionMobile: '50% 50%',
  },
  {
    id: 'jubilee-house',
    mobileImage: cultureImages.flagstaffHouse,
    desktopImage: cultureImages.flagstaffHouseDesktop,
    alt: 'Jubilee House, the presidential palace in Accra, Ghana',
    objectPositionMobile: '50% 50%',
  },
] as const;

/** Background slides for the welcome section, distinct from hero. */
export const welcomeCarouselSlides = [
  {
    src: cultureImages.hero,
    alt: 'Community celebrating Ghanaian heritage at Ghana Day in Tampa Bay',
    objectPosition: '50% 40%',
  },
  {
    src: cultureImages.family,
    alt: 'Ghanaian family enjoying traditional games together at a community cultural festival',
    objectPosition: '50% 50%',
  },
  {
    src: cultureImages.welcomeDrummers,
    alt: 'Ghanaian traditional drummers performing at a community celebration',
    objectPosition: '50% 50%',
  },
] as const;

/** Fashion section editorial images (five photographs, fixed grid slots). */
export const fashionSectionImages = [
  {
    slot: 'featured',
    src: '/images/gallery/fashion-traditional-portrait.jpg',
    alt: 'Woman with natural afro hair wearing a black-and-orange Ghanaian-print outfit',
  },
  {
    slot: 'street',
    src: '/images/pulse/fashion.jpg',
    alt: 'Two people in coordinated Ghanaian smock and striped street-fashion outfits',
  },
  {
    slot: 'white',
    src: '/images/gallery/fashion-heritage-portrait.jpg',
    alt: 'Woman dressed in white with a white headwrap and green leaf garland',
  },
  {
    slot: 'group',
    src: '/images/gallery/fashion-editorial-group.jpg',
    alt: 'Four adults in coordinated Ghanaian kente and smock fashion for an editorial portrait',
  },
  {
    slot: 'walking',
    src: '/images/gallery/cultural-diversity.jpg',
    alt: 'Three people walking together in traditional Ghanaian festival fashion',
  },
] as const;

export const cultureRegions = [
  {
    id: 'ga',
    name: 'Ga Culture',
    subtitle: 'Greater Accra',
    image: cultureImages.ga,
    description: 'Beaded traditions, kpalogo rhythms, and the spirit of Homowo.',
  },
  {
    id: 'ewe',
    name: 'Ewe Culture',
    subtitle: 'Volta Region',
    image: cultureImages.ewe,
    description: 'Agbadza dance, woven Ewe cloth, and the heartbeat of the Volta.',
  },
  {
    id: 'northern',
    name: 'Northern Culture',
    subtitle: 'Savannah & North',
    image: cultureImages.northern,
    description: 'Handwoven fugu smocks, Bolga baskets, and northern pride.',
  },
  {
    id: 'fante',
    name: 'Fante Culture',
    subtitle: 'Central Coast',
    image: cultureImages.fante,
    description: 'Coastal heritage, fishing traditions, and vibrant Fante dress.',
  },
] as const;
