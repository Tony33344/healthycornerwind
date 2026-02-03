import { StaticTestimonial, Testimonial } from '../../types/testimonial'

// Static testimonials for development and fallback
export const STATIC_TESTIMONIALS: StaticTestimonial[] = [
  {
    name: 'Ana Novak',
    location: 'Ljubljana, Slovenija',
    rating: 5,
    comment: 'Neverjeten wellness doživetjek! Jutranja joga v naravi je bila popolna, ledene kopeli pa so me popolnoma osvežile. Priporočam vsem, ki iščete pravi oddih.',
    service_category: 'yoga',
    is_featured: true
  },
  {
    name: 'Marko Petrič',
    location: 'Maribor, Slovenija',
    rating: 5,
    comment: 'Ledene kopeli so bile izziv, a rezultat je bil fantastičen. Počutim se bolj energičen kot kadarkoli prej. Osebje je bilo izjemno prijazno in strokovno.',
    service_category: 'ice-bathing',
    is_featured: true
  },
  {
    name: 'Sara Kos',
    location: 'Kranj, Slovenija',
    rating: 4,
    comment: 'Wellness delavnice so bile zelo poučne. Naučila sem se veliko o zdravem življenjskem slogu. Hrana je bila okusna in zdrava.',
    service_category: 'workshops',
    is_featured: false
  },
  {
    name: 'Luka Horvat',
    location: 'Celje, Slovenija',
    rating: 5,
    comment: 'Popoln vikend za sprostitev. Kombinacija joge, ledenih kopeli in zdrave hrane je bila natanko to, kar sem potreboval. Definitivno se vrnem!',
    service_category: 'yoga',
    is_featured: true
  },
  {
    name: 'Maja Zupan',
    location: 'Koper, Slovenija',
    rating: 4,
    comment: 'Čudovita lokacija in odličen program. Posebej mi je bila všeč meditacija ob sončnem vzhodu. Malo drago, a vredno vsakega evra.',
    service_category: 'workshops',
    is_featured: false
  },
  {
    name: 'Janez Kralj',
    location: 'Nova Gorica, Slovenija',
    rating: 5,
    comment: 'Kot športnik sem vedno skeptičen do novih metod, a ledene kopeli so me popolnoma prepričale. Okrevanje po treningih je zdaj veliko hitrejše.',
    service_category: 'ice-bathing',
    is_featured: true
  },
  {
    name: 'Petra Golob',
    location: 'Novo Mesto, Slovenija',
    rating: 4,
    comment: 'Odličen program za začetnike. Instruktorji so potrpežljivi in strokovno usposobljeni. Atmosfera je bila sproščena in prijazna.',
    service_category: 'yoga',
    is_featured: false
  },
  {
    name: 'Tomaž Mlakar',
    location: 'Ptuj, Slovenija',
    rating: 5,
    comment: 'Najboljši wellness center v Sloveniji! Vse je bilo organizirano do potankosti. Hrana, nastanitev, programi - vse na najvišji ravni.',
    service_category: 'workshops',
    is_featured: true
  }
]

// Convert static testimonials to full Testimonial objects
export const getStaticTestimonials = (): Testimonial[] => {
  return STATIC_TESTIMONIALS.map((staticTestimonial, index) => ({
    id: `static-testimonial-${index + 1}`,
    name: staticTestimonial.name,
    location: staticTestimonial.location,
    rating: staticTestimonial.rating,
    comment: staticTestimonial.comment,
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 90 days
    service_category: staticTestimonial.service_category,
    is_featured: staticTestimonial.is_featured,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
}

// Get featured testimonials only
export const getFeaturedTestimonials = (): Testimonial[] => {
  return getStaticTestimonials().filter(testimonial => testimonial.is_featured)
}

// Get testimonials by category
export const getTestimonialsByCategory = (category: string): Testimonial[] => {
  return getStaticTestimonials().filter(testimonial => testimonial.service_category === category)
}

// Get testimonials with high ratings (4+ stars)
export const getHighRatedTestimonials = (): Testimonial[] => {
  return getStaticTestimonials().filter(testimonial => testimonial.rating >= 4)
}

// Calculate average rating
export const getAverageRating = (testimonials: Testimonial[] = getStaticTestimonials()): number => {
  if (testimonials.length === 0) return 0
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0)
  return Math.round((totalRating / testimonials.length) * 10) / 10 // Round to 1 decimal place
}
