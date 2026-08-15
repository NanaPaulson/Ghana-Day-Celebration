export const SITE_URL = 'https://www.ghanadaytb.com';
export const ORGANIZATION_NAME = 'Ghanaian Association of Tampa Bay';
export const EVENT_BRAND_NAME = 'Ghana Day in Tampa Bay';
export const EVENT_ALT_NAME = 'Ghana Fest Florida 2026';
export const EVENT_NAME = `${EVENT_BRAND_NAME} 2026`;
export const EVENT_DATE = 'Saturday, November 7, 2026';
export const EVENT_ISO_DATE = '2026-11-07';
export const EVENT_START_ISO = '2026-11-07T09:00:00-05:00';
export const EVENT_TIME = '9:00 AM';
export const EVENT_DESCRIPTION =
  'Join the maiden edition of Ghana Day in Tampa Bay at Rowlett Park. Celebrate Ghanaian heritage and the African diaspora with cultural performances, music, dance, cuisine, fashion, vendor exhibitions, youth and family activities, and community networking.';
export const CONTACT_EMAIL = 'info@ghanadaytb.com';
export const CONTACT_PHONE = '7274703000';
export const CONTACT_PHONE_DISPLAY = '(727) 470-3000';
// Flyer lists additional numbers: 727.458.6953, 813.465.0936, 727.479.7515, 614.772.1995
export const VENDOR_FORM_URL = 'VENDOR_FORM_URL';
export const SPONSOR_PDF_URL = 'SPONSOR_PDF_URL';
export const MAILERLITE_ENDPOINT = 'MAILERLITE_ENDPOINT';
export const DEADLINE_PLACEHOLDER = 'DEADLINE_PLACEHOLDER';

/** True when a constant still needs a real value before launch. */
export function isPlaceholder(value: string): boolean {
  return (
    value.includes('PLACEHOLDER') ||
    value === '$PRICE' ||
    value === 'CONTACT_EMAIL' ||
    value === 'VENDOR_FORM_URL' ||
    value === 'SPONSOR_PDF_URL' ||
    value === 'MAILERLITE_ENDPOINT'
  );
}

export const VENUE = {
  name: 'Rowlett Park',
  street: '2401 E Yukon St',
  city: 'Tampa',
  state: 'FL',
  zip: '33604',
  full: 'Rowlett Park, 2401 E Yukon St, Tampa, FL 33604',
  lat: 27.996944,
  lng: -82.432222,
  mapsQuery: '2401 E Yukon St, Tampa, FL 33604',
};

export const SOCIAL = {
  facebook: 'https://www.facebook.com/GhanaDayInTampaBayOfficial',
  instagram: 'https://www.instagram.com/GhanaDayInTampaBayOfficial',
  tiktok: 'https://www.tiktok.com/@GhanaDayInTampaBayOfficial',
  youtube: 'https://www.youtube.com/@GhanaDayInTampaBayOfficial',
};
