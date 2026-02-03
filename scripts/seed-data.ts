import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedData() {
  console.log('🌱 Seeding test data...\n')
  
  try {
    // 1. SERVICES
    console.log('📦 Creating services...')
    const services = [
      {
        name_sl: 'Jutranjo joga',
        name_en: 'Morning Yoga',
        name_nl: 'Ochtend Yoga',
        name_de: 'Morgen Yoga',
        description_sl: 'Začnite dan z mirno jutranje jogo',
        description_en: 'Start your day with peaceful morning yoga',
        description_nl: 'Begin je dag met vredige ochtendyoga',
        description_de: 'Beginnen Sie Ihren Tag mit friedlichem Morgen-Yoga',
        price: 25.00,
        duration: 60,
        capacity: 15,
        category: 'Yoga',
        status: 'published'
      },
      {
        name_sl: 'Ledena kopel',
        name_en: 'Ice Bath Session',
        name_nl: 'IJsbad Sessie',
        name_de: 'Eisbad Sitzung',
        description_sl: 'Okrepite telo in um z ledeno kopeljo',
        description_en: 'Strengthen body and mind with ice bathing',
        description_nl: 'Versterk lichaam en geest met ijsbaden',
        description_de: 'Stärken Sie Körper und Geist mit Eisbaden',
        price: 35.00,
        duration: 30,
        capacity: 8,
        category: 'Ice Bathing',
        status: 'published',
        
      },
      {
        name_sl: 'Delavnica dihanja',
        name_en: 'Breathwork Workshop',
        name_nl: 'Ademwerk Workshop',
        name_de: 'Atemarbeit Workshop',
        description_sl: 'Naučite se moči zavestnega dihanja',
        description_en: 'Learn the power of conscious breathing',
        description_nl: 'Leer de kracht van bewust ademhalen',
        description_de: 'Lernen Sie die Kraft des bewussten Atmens',
        price: 45.00,
        duration: 90,
        capacity: 12,
        category: 'Workshops',
        status: 'published',
        
      },
      {
        name_sl: 'Vikend paket wellness',
        name_en: 'Weekend Wellness Package',
        name_nl: 'Weekend Wellness Pakket',
        name_de: 'Wochenend Wellness Paket',
        description_sl: '2-dnevni popoln oddih s jogo, kopelmi in masažami',
        description_en: '2-day complete retreat with yoga, baths and massages',
        description_nl: '2-daagse complete retraite met yoga, baden en massages',
        description_de: '2-tägiger kompletter Rückzug mit Yoga, Bädern und Massagen',
        price: 299.00,
        duration: 2880,
        capacity: 10,
        category: 'Packages',
        status: 'published',
        
      },
      {
        name_sl: 'Popoldan joga',
        name_en: 'Afternoon Yoga',
        name_nl: 'Middag Yoga',
        name_de: 'Nachmittag Yoga',
        description_sl: 'Sprostite se po napornem dnevu',
        description_en: 'Relax after a busy day',
        description_nl: 'Ontspan na een drukke dag',
        description_de: 'Entspannen Sie sich nach einem anstrengenden Tag',
        price: 25.00,
        duration: 60,
        capacity: 15,
        category: 'Yoga',
        status: 'published',
        
      }
    ]

    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .insert(services)
      .select()

    if (servicesError) throw servicesError
    console.log(`✅ Created ${servicesData.length} services`)

    // 2. MENU ITEMS
    console.log('🍽️ Creating menu items...')
    const menuItems = [
      {
        name_sl: 'Zeleni smoothie',
        name_en: 'Green Smoothie',
        name_nl: 'Groene Smoothie',
        name_de: 'Grüner Smoothie',
        description_sl: 'Osvežilna mešanica zelenjave in sadja',
        description_en: 'Refreshing blend of vegetables and fruits',
        description_nl: 'Verfrissende mix van groenten en fruit',
        description_de: 'Erfrischende Mischung aus Gemüse und Obst',
        price: 8.50,
        allergens: [],
        category: 'Beverages',
        status: 'published'
      },
      {
        name_sl: 'Proteinska kroglica',
        name_en: 'Protein Ball',
        name_nl: 'Eiwit Bal',
        name_de: 'Protein Kugel',
        description_sl: 'Domače energijske kroglice z oreščki',
        description_en: 'Homemade energy balls with nuts',
        description_nl: 'Huisgemaakte energieballen met noten',
        description_de: 'Hausgemachte Energiekugeln mit Nüssen',
        price: 3.50,
        allergens: ['Nuts'],
        category: 'Snacks',
        status: 'published'
      },
      {
        name_sl: 'Buddha skleda',
        name_en: 'Buddha Bowl',
        name_nl: 'Buddha Bowl',
        name_de: 'Buddha Schüssel',
        description_sl: 'Pestra skleda s kvinojo, zelenjavo in humusom',
        description_en: 'Colorful bowl with quinoa, vegetables and hummus',
        description_nl: 'Kleurrijke bowl met quinoa, groenten en hummus',
        description_de: 'Bunte Schüssel mit Quinoa, Gemüse und Hummus',
        price: 14.00,
        allergens: ['Sesame'],
        category: 'Meals',
        status: 'published'
      },
      {
        name_sl: 'Matcha latte',
        name_en: 'Matcha Latte',
        name_nl: 'Matcha Latte',
        name_de: 'Matcha Latte',
        description_sl: 'Tradicionalni japonski zeleni čaj z mlekom',
        description_en: 'Traditional Japanese green tea with milk',
        description_nl: 'Traditionele Japanse groene thee met melk',
        description_de: 'Traditioneller japanischer grüner Tee mit Milch',
        price: 5.50,
        allergens: ['Dairy'],
        category: 'Beverages',
        status: 'published'
      },
      {
        name_sl: 'Vitamin C boost',
        name_en: 'Vitamin C Boost',
        name_nl: 'Vitamine C Boost',
        name_de: 'Vitamin C Boost',
        description_sl: 'Naravni vitamin C dodatek za imunski sistem',
        description_en: 'Natural vitamin C supplement for immune system',
        description_nl: 'Natuurlijk vitamine C supplement voor immuunsysteem',
        description_de: 'Natürliches Vitamin-C-Präparat für das Immunsystem',
        price: 12.00,
        allergens: [],
        category: 'Supplements',
        status: 'published'
      }
    ]

    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select()

    if (menuError) throw menuError
    console.log(`✅ Created ${menuData.length} menu items`)

    // 3. SCHEDULES
    console.log('📅 Creating schedules...')
    const schedules = [
      {
        day_of_week: 1, // Monday
        time: '07:00:00',
        service_id: servicesData[0].id,
        instructor: 'Ana Novak',
        capacity: 15
      },
      {
        day_of_week: 1,
        time: '17:00:00',
        service_id: servicesData[4].id,
        instructor: 'Marko Horvat',
        capacity: 15
      },
      {
        day_of_week: 2, // Tuesday
        time: '09:00:00',
        service_id: servicesData[1].id,
        instructor: 'Eva Krajnc',
        capacity: 8
      },
      {
        day_of_week: 3, // Wednesday
        time: '07:00:00',
        service_id: servicesData[0].id,
        instructor: 'Ana Novak',
        capacity: 15
      },
      {
        day_of_week: 4, // Thursday
        time: '18:00:00',
        service_id: servicesData[2].id,
        instructor: 'Luka Petrič',
        capacity: 12
      },
      {
        day_of_week: 5, // Friday
        time: '07:00:00',
        service_id: servicesData[0].id,
        instructor: 'Ana Novak',
        capacity: 15
      },
      {
        day_of_week: 6, // Saturday
        time: '10:00:00',
        service_id: servicesData[3].id,
        instructor: 'Team',
        capacity: 10
      }
    ]

    const { data: schedulesData, error: schedulesError } = await supabase
      .from('schedules')
      .insert(schedules)
      .select()

    if (schedulesError) throw schedulesError
    console.log(`✅ Created ${schedulesData.length} schedules`)

    // 4. BOOKINGS
    console.log('📝 Creating bookings...')
    const bookings = [
      {
        customer_name: 'Petra Novak',
        customer_email: 'petra.novak@example.com',
        customer_phone: '+386 31 123 456',
        service_name: 'Morning Yoga',
        service_id: servicesData[0].id,
        date: '2025-01-20',
        time: '07:00',
        status: 'confirmed',
        price: 25.00,
        notes: 'First time visitor'
      },
      {
        customer_name: 'Jan Kovač',
        customer_email: 'jan.kovac@example.com',
        customer_phone: '+386 41 234 567',
        service_name: 'Ice Bath Session',
        service_id: servicesData[1].id,
        date: '2025-01-21',
        time: '09:00',
        status: 'pending',
        price: 35.00,
        notes: ''
      },
      {
        customer_name: 'Sara Kralj',
        customer_email: 'sara.kralj@example.com',
        customer_phone: '+386 51 345 678',
        service_name: 'Breathwork Workshop',
        service_id: servicesData[2].id,
        date: '2025-01-22',
        time: '18:00',
        status: 'confirmed',
        price: 45.00,
        notes: 'Regular customer'
      },
      {
        customer_name: 'Miha Zupan',
        customer_email: 'miha.zupan@example.com',
        customer_phone: '+386 40 456 789',
        service_name: 'Weekend Wellness Package',
        service_id: servicesData[3].id,
        date: '2025-01-25',
        time: '10:00',
        status: 'confirmed',
        price: 299.00,
        notes: 'Anniversary celebration'
      },
      {
        customer_name: 'Nina Horvat',
        customer_email: 'nina.horvat@example.com',
        customer_phone: '+386 31 567 890',
        service_name: 'Afternoon Yoga',
        service_id: servicesData[4].id,
        date: '2025-01-18',
        time: '17:00',
        status: 'completed',
        price: 25.00,
        notes: ''
      },
      {
        customer_name: 'Tomaž Novak',
        customer_email: 'tomaz.novak@example.com',
        customer_phone: '+386 41 678 901',
        service_name: 'Morning Yoga',
        service_id: servicesData[0].id,
        date: '2025-01-17',
        time: '07:00',
        status: 'completed',
        price: 25.00,
        notes: 'Enjoyed the session'
      },
      {
        customer_name: 'Maja Petrič',
        customer_email: 'maja.petric@example.com',
        customer_phone: '+386 51 789 012',
        service_name: 'Ice Bath Session',
        service_id: servicesData[1].id,
        date: '2025-01-15',
        time: '09:00',
        status: 'cancelled',
        price: 35.00,
        notes: 'Cancelled due to illness'
      }
    ]

    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .insert(bookings)
      .select()

    if (bookingsError) throw bookingsError
    console.log(`✅ Created ${bookingsData.length} bookings`)

    console.log('\n✅ ✅ ✅ Data seeding complete!\n')
    console.log('📊 Summary:')
    console.log(`  - ${servicesData.length} services`)
    console.log(`  - ${menuData.length} menu items`)
    console.log(`  - ${schedulesData.length} schedules`)
    console.log(`  - ${bookingsData.length} bookings\n`)

  } catch (error) {
    console.error('❌ Error seeding data:', error)
  }
}

seedData()
