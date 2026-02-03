#!/usr/bin/env node

// Script to populate Supabase with real data using REST API
// Using built-in fetch (Node.js 18+)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
};

// Real data for services
const services = [
  {
    id: 'srv_001',
    name_sl: 'Jutranja Joga',
    name_en: 'Morning Yoga',
    name_nl: 'Ochtend Yoga',
    name_de: 'Morgen Yoga',
    description_sl: 'Sproščujoča jutranja joga v naravi z razgledom na Alpe',
    description_en: 'Relaxing morning yoga in nature with Alpine views',
    description_nl: 'Ontspannende ochtendyoga in de natuur met uitzicht op de Alpen',
    description_de: 'Entspannende Morgen-Yoga in der Natur mit Alpenblick',
    price: 25.00,
    duration: 60,
    capacity: 12,
    category: 'Yoga',
    image_url: '/images/services/morning-yoga.jpg',
    status: 'published'
  },
  {
    id: 'srv_002',
    name_sl: 'Ledene Kopeli',
    name_en: 'Ice Bathing',
    name_nl: 'IJsbaden',
    name_de: 'Eisbaden',
    description_sl: 'Terapevtske ledene kopeli za krepitev imunskega sistema',
    description_en: 'Therapeutic ice baths for immune system strengthening',
    description_nl: 'Therapeutische ijsbaden voor versterking van het immuunsysteem',
    description_de: 'Therapeutische Eisbäder zur Stärkung des Immunsystems',
    price: 35.00,
    duration: 45,
    capacity: 8,
    category: 'Ice Bathing',
    image_url: '/images/services/ice-bathing.jpg',
    status: 'published'
  },
  {
    id: 'srv_003',
    name_sl: 'Dihalne Tehnike',
    name_en: 'Breathing Workshop',
    name_nl: 'Ademhalingsworkshop',
    name_de: 'Atemtechnik Workshop',
    description_sl: 'Učenje naprednih dihalnih tehnik za stresno upravljanje',
    description_en: 'Learning advanced breathing techniques for stress management',
    description_nl: 'Geavanceerde ademhalingstechnieken leren voor stressmanagement',
    description_de: 'Erlernen fortgeschrittener Atemtechniken für Stressmanagement',
    price: 40.00,
    duration: 90,
    capacity: 15,
    category: 'Workshops',
    image_url: '/images/services/breathing.jpg',
    status: 'published'
  },
  {
    id: 'srv_004',
    name_sl: 'Wellness Paket - Celodnevni',
    name_en: 'Full Day Wellness Package',
    name_nl: 'Volledige Dag Wellness Pakket',
    name_de: 'Ganztägiges Wellness-Paket',
    description_sl: 'Celodnevni program z jogo, ledenimi kopelmi in zdravo prehrano',
    description_en: 'Full day program with yoga, ice baths and healthy nutrition',
    description_nl: 'Volledige dagprogramma met yoga, ijsbaden en gezonde voeding',
    description_de: 'Ganztägiges Programm mit Yoga, Eisbädern und gesunder Ernährung',
    price: 120.00,
    duration: 480,
    capacity: 10,
    category: 'Packages',
    image_url: '/images/services/full-day.jpg',
    status: 'published'
  }
];

// Real data for schedules
const schedules = [
  // Morning Yoga
  { id: 'sch_001', service_id: 'srv_001', day_of_week: 1, start_time: '07:00', end_time: '08:00', instructor_name: 'Ana Novak', max_participants: 12, available_spots: 8, is_active: true },
  { id: 'sch_002', service_id: 'srv_001', day_of_week: 2, start_time: '07:00', end_time: '08:00', instructor_name: 'Ana Novak', max_participants: 12, available_spots: 5, is_active: true },
  { id: 'sch_003', service_id: 'srv_001', day_of_week: 3, start_time: '07:00', end_time: '08:00', instructor_name: 'Ana Novak', max_participants: 12, available_spots: 10, is_active: true },
  
  // Ice Bathing
  { id: 'sch_006', service_id: 'srv_002', day_of_week: 1, start_time: '09:00', end_time: '09:45', instructor_name: 'Marko Petrič', max_participants: 8, available_spots: 3, is_active: true },
  { id: 'sch_007', service_id: 'srv_002', day_of_week: 1, start_time: '16:00', end_time: '16:45', instructor_name: 'Marko Petrič', max_participants: 8, available_spots: 6, is_active: true },
  { id: 'sch_008', service_id: 'srv_002', day_of_week: 2, start_time: '09:00', end_time: '09:45', instructor_name: 'Marko Petrič', max_participants: 8, available_spots: 4, is_active: true },
  
  // Breathing Workshop
  { id: 'sch_020', service_id: 'srv_003', day_of_week: 2, start_time: '14:00', end_time: '15:30', instructor_name: 'Sara Kos', max_participants: 15, available_spots: 12, is_active: true },
  { id: 'sch_021', service_id: 'srv_003', day_of_week: 4, start_time: '14:00', end_time: '15:30', instructor_name: 'Sara Kos', max_participants: 15, available_spots: 8, is_active: true }
];

// Real data for menu items
const menuItems = [
  {
    id: 'menu_001',
    name_sl: 'Alpska Zdrava Skleda',
    name_en: 'Alpine Healthy Bowl',
    name_nl: 'Alpine Gezonde Bowl',
    name_de: 'Alpine Gesunde Schüssel',
    description_sl: 'Hranljiva skleda z lokalnimi sestavinami',
    description_en: 'Nutritious bowl with local ingredients',
    description_nl: 'Voedzame bowl met lokale ingrediënten',
    description_de: 'Nahrhafte Schüssel mit lokalen Zutaten',
    price: 14.50,
    ingredients_sl: 'Kvinoja, avokado, rdeča pesa, orehi, olivno olje',
    ingredients_en: 'Quinoa, avocado, beetroot, walnuts, olive oil',
    ingredients_nl: 'Quinoa, avocado, rode biet, walnoten, olijfolie',
    ingredients_de: 'Quinoa, Avocado, Rote Bete, Walnüsse, Olivenöl',
    allergens: ['nuts'],
    category: 'Meals',
    image_url: '/images/menu/alpine-bowl.jpg',
    stock: 25,
    status: 'published'
  },
  {
    id: 'menu_002',
    name_sl: 'Planinski Wrap',
    name_en: 'Mountain Wrap',
    name_nl: 'Berg Wrap',
    name_de: 'Berg Wrap',
    description_sl: 'Polnozrnati wrap z zelenjavo in humusom',
    description_en: 'Whole grain wrap with vegetables and hummus',
    description_nl: 'Volkoren wrap met groenten en hummus',
    description_de: 'Vollkorn-Wrap mit Gemüse und Hummus',
    price: 12.00,
    ingredients_sl: 'Polnozrnata tortilja, hummus, paprika, kumare, paradižnik',
    ingredients_en: 'Whole grain tortilla, hummus, peppers, cucumber, tomato',
    ingredients_nl: 'Volkoren tortilla, hummus, paprika, komkommer, tomaat',
    ingredients_de: 'Vollkorn-Tortilla, Hummus, Paprika, Gurke, Tomate',
    allergens: ['gluten'],
    category: 'Meals',
    image_url: '/images/menu/mountain-wrap.jpg',
    stock: 30,
    status: 'published'
  },
  {
    id: 'menu_006',
    name_sl: 'Zeleni Smoothie',
    name_en: 'Green Smoothie',
    name_nl: 'Groene Smoothie',
    name_de: 'Grüner Smoothie',
    description_sl: 'Osvežujoč zeleni smoothie z špinačo in sadjem',
    description_en: 'Refreshing green smoothie with spinach and fruit',
    description_nl: 'Verfrissende groene smoothie met spinazie en fruit',
    description_de: 'Erfrischender grüner Smoothie mit Spinat und Obst',
    price: 7.50,
    ingredients_sl: 'Špinača, banana, mango, kokosovo mleko',
    ingredients_en: 'Spinach, banana, mango, coconut milk',
    ingredients_nl: 'Spinazie, banaan, mango, kokosmelk',
    ingredients_de: 'Spinat, Banane, Mango, Kokosmilch',
    allergens: [],
    category: 'Beverages',
    image_url: '/images/menu/green-smoothie.jpg',
    stock: 40,
    status: 'published'
  }
];

async function populateData() {
  console.log('🚀 Starting to populate Supabase with real data...');
  
  try {
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*`, { method: 'DELETE', headers });
    await fetch(`${SUPABASE_URL}/rest/v1/schedules?select=*`, { method: 'DELETE', headers });
    await fetch(`${SUPABASE_URL}/rest/v1/services?select=*`, { method: 'DELETE', headers });
    await fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=*`, { method: 'DELETE', headers });
    
    // Insert services
    console.log('📋 Inserting services...');
    const servicesResponse = await fetch(`${SUPABASE_URL}/rest/v1/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify(services)
    });
    
    if (!servicesResponse.ok) {
      const error = await servicesResponse.text();
      console.error('Services error:', error);
    } else {
      console.log('✅ Services inserted successfully');
    }
    
    // Insert schedules
    console.log('📅 Inserting schedules...');
    const schedulesResponse = await fetch(`${SUPABASE_URL}/rest/v1/schedules`, {
      method: 'POST',
      headers,
      body: JSON.stringify(schedules)
    });
    
    if (!schedulesResponse.ok) {
      const error = await schedulesResponse.text();
      console.error('Schedules error:', error);
    } else {
      console.log('✅ Schedules inserted successfully');
    }
    
    // Insert menu items
    console.log('🍽️ Inserting menu items...');
    const menuResponse = await fetch(`${SUPABASE_URL}/rest/v1/menu_items`, {
      method: 'POST',
      headers,
      body: JSON.stringify(menuItems)
    });
    
    if (!menuResponse.ok) {
      const error = await menuResponse.text();
      console.error('Menu items error:', error);
    } else {
      console.log('✅ Menu items inserted successfully');
    }
    
    console.log('🎉 Database populated with real data successfully!');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

populateData();
