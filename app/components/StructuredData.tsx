'use client'

interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Helper function to generate service schema
export function generateServiceSchema(service: any, locale: string) {
  const baseUrl = 'https://healthycorner.si'
  const localePath = locale === 'en' ? '' : `/${locale}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service[`name_${locale}`] || service.name_en,
    description: service[`description_${locale}`] || service.description_en,
    provider: {
      '@type': 'Organization',
      name: 'Healthy Corner',
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Slovenia',
    },
    url: `${baseUrl}${localePath}/services#${service.id}`,
    image: service.image_url?.startsWith('http') 
      ? service.image_url 
      : `${baseUrl}${service.image_url}`,
  }
}

// Helper function to generate services list schema
export function generateServicesListSchema(services: any[], locale: string) {
  const baseUrl = 'https://healthycorner.si'
  const localePath = locale === 'en' ? '' : `/${locale}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'en' ? 'Wellness Services' : 'Wellness Dienstleistungen',
    description: locale === 'en' 
      ? 'List of wellness services offered at Healthy Corner retreat'
      : 'Liste der Wellness-Dienstleistungen im Healthy Corner Retreat',
    url: `${baseUrl}${localePath}/services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateServiceSchema(service, locale),
    })),
  }
}

// Helper function to generate breadcrumb schema
export function generateBreadcrumbSchema(locale: string) {
  const baseUrl = 'https://healthycorner.si'
  const localePath = locale === 'en' ? '' : `/${locale}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'en' ? 'Services' : 'Dienstleistungen',
        item: `${baseUrl}${localePath}/services`,
      },
    ],
  }
}

// Helper function to generate organization schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Healthy Corner',
    url: 'https://healthycorner.si',
    logo: 'https://healthycorner.si/images/logo.png',
    description: 'Wellness retreat offering yoga, ice bathing, workshops, and healthy nutrition',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SI',
      addressRegion: 'Slovenia',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Slovenian', 'Dutch', 'German'],
    },
    sameAs: [
      // Add social media URLs if available
    ],
  }
}
