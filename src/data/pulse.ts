export const pulseNav = [
  { href: '#welcome', label: 'Welcome' },
  { href: '#culture', label: 'Culture' },
  { href: '#music', label: 'Music' },
  { href: '#fashion', label: 'Fashion' },
  { href: '#history', label: 'History' },
  { href: '#marketplace', label: 'Marketplace' },
  { href: '#schedule', label: 'Schedule' },
] as const;

export const pulseStats = [
  { value: '2026', label: 'Inaugural Year' },
  { value: '1', label: 'Epic Day' },
  { value: '∞', label: 'Memories' },
] as const;

/** Welcome carousel: text panels synced with background images. */
export const welcomeSlides = [
  {
    id: 'purpose',
    heading: [
      { text: 'Ghana Day in', accent: false },
      { text: 'Tampa Bay.', accent: true },
      { text: 'Our Purpose.', accent: false },
    ],
    body: [
      'The purpose of Ghana Day in Tampa Bay (Ghana Fest Florida 2026) is to celebrate and preserve Ghanaian culture, promote diversity and multicultural engagement, and encourage cultural exchange.',
      'We showcase Ghanaian entrepreneurship, arts, and traditions for the Ghanaian and African diaspora across Florida and neighboring states.',
    ],
    stats: pulseStats,
  },
  {
    id: 'homecoming',
    heading: [
      { text: 'One People.', accent: false },
      { text: 'Diverse Culture.', accent: true },
      { text: 'One Great Celebration.', accent: false },
    ],
    body: [
      'The Ghanaian Association of Tampa Bay presents the maiden edition of Ghana Day in Tampa Bay 2026, a cultural celebration highlighting the heritage, traditions, and contributions of Ghana and the African diaspora.',
      'Join us as we celebrate the richness of Ghanaian tradition, the beauty of its people, and the pride of a culture that resonates across the globe.',
    ],
    stats: pulseStats,
  },
  {
    id: 'independence',
    heading: [
      { text: 'From Gold Coast', accent: false },
      { text: 'To Ghana.', accent: true },
      { text: 'A Nation Is Born.', accent: false },
    ],
    body: [
      'On March 6, 1957, Ghana became the first Sub-Saharan African country to break free from colonial rule, led by Kwame Nkrumah and generations of resistance.',
      'That historic victory lit a flame across the continent. Today, Ghana Day in Tampa Bay honors that courage and the diaspora carrying it forward.',
    ],
    stats: [
      { value: '1957', label: 'Independence' },
      { value: '1st', label: 'Free Nation' },
      { value: '★', label: 'Black Star' },
    ],
  },
  {
    id: 'heritage',
    heading: [
      { text: 'Kingdoms.', accent: false },
      { text: 'Empires.', accent: true },
      { text: 'Living History.', accent: false },
    ],
    body: [
      'Long before independence, the Akan, Ga-Adangbe, Ewe, Guan, Gurma, Mole-Dagbani, Grusi, and Mande clans built powerful societies rich in art, trade, governance, and oral tradition.',
      'From ancient kente weaving to Adinkra symbols, Ghana\'s story is written in cloth, drum, and community. Ghana Day brings that living history to Tampa Bay.',
    ],
    stats: [
      { value: '1471', label: 'Gold Coast Era' },
      { value: '100+', label: 'Clans' },
      { value: '∞', label: 'Traditions' },
    ],
  },
] as const;

export const foodItems = [
  'Jollof Rice',
  'Kelewele',
  'Banku',
  'Waakye',
  'Fufu',
  'Grilled Tilapia',
] as const;

export const musicGenres = [
  {
    title: 'Highlife',
    description:
      'The golden sound of Ghana: smooth guitars, horns, and irresistible grooves',
  },
  {
    title: 'Azonto',
    description:
      'The beat that took the world by storm: dance, energy, and pure joy',
  },
  {
    title: 'Traditional Drums',
    description:
      'Fontomfrom, Kpanlogo, Adowa: rhythms that carry centuries of history',
  },
  {
    title: 'Afrobeats',
    description: "Ghana's modern pulse, blending heritage with global influence",
  },
] as const;

export const flagColors = [
  { name: 'Gold', meaning: 'Royalty & Wealth', color: '#F2A900' },
  { name: 'Green', meaning: 'Growth & Harvest', color: '#006B3F' },
  { name: 'Red', meaning: 'Sacrifice & Blood', color: '#C8102E' },
  { name: 'Black', meaning: 'Maturity & Spirit', color: '#1A1613' },
] as const;

export const adinkraSymbols = [
  {
    id: 'gye-nyame',
    name: 'Gye Nyame',
    meaning: 'Except God',
    description:
      'The supremacy and omnipotence of God. The most popular Adinkra symbol.',
  },
  {
    id: 'sankofa',
    name: 'Sankofa',
    meaning: 'Go Back & Get It',
    description:
      'Learn from the past. It is not wrong to go back for what you have forgotten.',
  },
  {
    id: 'dwennimmen',
    name: 'Dwennimmen',
    meaning: "Ram's Horns",
    description: 'Humility together with strength. Even the strong must be humble.',
  },
  {
    id: 'adinkrahene',
    name: 'Adinkrahene',
    meaning: 'Chief of Symbols',
    description:
      'Greatness, charisma, and leadership. The inspiration for all Adinkra designs.',
  },
  {
    id: 'nyame-nti',
    name: 'Nyame Nti',
    meaning: "By God's Grace",
    description:
      'Faith and trust in God. A reminder that all things are possible through faith.',
  },
  {
    id: 'funtunfunefu',
    name: 'Funtunfunefu',
    meaning: 'Unity in Diversity',
    description:
      'Siamese crocodiles sharing one stomach. Unity despite individual differences.',
  },
] as const;

export const historyTimeline = [
  {
    year: '1471',
    text: 'Portuguese arrive on the Gold Coast, beginning European contact with the Akan kingdoms.',
  },
  {
    year: '1874',
    text: 'The Gold Coast is established as a British Crown Colony, igniting the fire of independence movements.',
  },
  {
    year: '1957',
    text: 'Ghana becomes the first Sub-Saharan African nation to gain independence, led by Kwame Nkrumah.',
  },
  {
    year: '1960',
    text: 'The Republic of Ghana is proclaimed. Nkrumah becomes the first President.',
  },
  {
    year: '1992',
    text: 'A new constitution ushers in the Fourth Republic and multi-party democracy.',
  },
  {
    year: '2026',
    text: 'Ghana Day in Tampa Bay 2026 launches its maiden edition, welcoming the Ghanaian and African diaspora from across Florida and neighboring states.',
  },
] as const;

export const marketplaceItems = [
  {
    category: 'Textiles',
    title: 'Ewe Kete Cloth',
    description: 'Handwoven indigo-and-white cloth from the Volta Region',
  },
  {
    category: 'Jewelry',
    title: 'Glass Bead Jewelry',
    description: 'Krobo beads crafted through ancient powder-glass techniques',
  },
  {
    category: 'Woodcraft',
    title: 'Carved Stools',
    description: 'Symbolic stools representing proverbs and spiritual power',
  },
  {
    category: 'Fashion',
    title: 'Batakari Smock',
    description: "Northern Ghana's iconic hand-loomed and hand-sewn garment",
  },
  {
    category: 'Beauty',
    title: 'Shea Butter',
    description: 'Pure, unrefined shea from the savannahs of the north',
  },
  {
    category: 'Basketry',
    title: 'Bolga Baskets',
    description: 'Vibrant handwoven baskets from the Upper East Region',
  },
] as const;

export const communitySectors = [
  {
    title: 'Cultural Exchange',
    description:
      'Celebrate and preserve Ghanaian culture while promoting diversity, multicultural engagement, and cultural exchange.',
  },
  {
    title: 'Youth & Education',
    description:
      'Youth and family activities that build cultural awareness, unity, education, and community development.',
  },
  {
    title: 'Business & Networking',
    description:
      'Showcase Ghanaian entrepreneurship, arts, and traditions while connecting diaspora organizations across Florida.',
  },
] as const;

export const inquirySectors = [
  'Ghanaian / African Diaspora Association',
  'Business & Trade',
  'Community & Culture',
  'Non-Profit & Aid',
  'Sponsorship',
  'Vendor / Exhibitor',
  'Other',
] as const;

export const scheduleItems = [
  {
    time: '10:00 AM',
    category: 'Ceremony',
    title: 'Gates Open',
    description: 'Welcome ceremony and opening libation prayer',
  },
  {
    time: '10:30 AM',
    category: 'Food',
    title: 'Taste Ghana',
    description: 'Food vendors open: Jollof, Kelewele, Banku, and more',
  },
  {
    time: '11:00 AM',
    category: 'Shopping',
    title: 'Marketplace Opens',
    description: 'Shop Bolga baskets, beads, smocks, woven cloth, and art',
  },
  {
    time: '12:00 PM',
    category: 'Music',
    title: 'Traditional Drumming',
    description: 'Live performances by master Fontomfrom and Kpanlogo drummers',
  },
  {
    time: '1:30 PM',
    category: 'Fashion',
    title: 'Fashion with Heritage',
    description: 'Runway show featuring Ga, Ewe, Northern, and Fante regional dress',
  },
  {
    time: '3:00 PM',
    category: 'Community',
    title: 'Community Networking',
    description: 'Connect with Ghanaian and African diaspora organizations, businesses, and community leaders',
  },
  {
    time: '4:30 PM',
    category: 'Music',
    title: 'Highlife & Afrobeats Live',
    description: 'Live music, dance, and pure celebration under the Florida sun',
  },
  {
    time: '7:00 PM',
    category: 'Ceremony',
    title: 'Grand Finale',
    description: 'Closing ceremony, cultural blessings, and farewell',
  },
] as const;
