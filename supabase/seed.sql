-- Seed Data for Healthy Corner Platform
-- Run this after migrations to populate development data

-- ================================================
-- SERVICES SEED DATA
-- ================================================
INSERT INTO services (name_en, name_sl, name_nl, name_de, description_en, description_sl, description_nl, description_de, price, duration, capacity, category, image_url, status) VALUES
-- Yoga Services
('Morning Yoga Flow', 'Jutranja joga', 'Ochtend Yoga', 'Morgen Yoga', 
 'Start your day with energizing yoga poses and breathing exercises in nature', 
 'Začnite dan z energiziranimi jogijskimi pozami in dihalnimi vajami v naravi',
 'Begin je dag met energieke yogahoudingen en ademhalingsoefeningen in de natuur',
 'Beginnen Sie Ihren Tag mit energetisierenden Yogapositionen und Atemübungen in der Natur',
 25.00, 60, 15, 'Yoga', '/images/gallery/DSC_4866.JPG', 'published'),

('Sunset Meditation', 'Meditacija ob sončnem zahodu', 'Zonsondergang Meditatie', 'Sonnenuntergang Meditation',
 'Peaceful meditation session as the sun sets over the mountains',
 'Mirna meditacija, ko sonce zahaja za hribovjem',
 'Vredige meditatie sessie terwijl de zon ondergaat achter de bergen',
 'Friedliche Meditationssitzung während die Sonne hinter den Bergen untergeht',
 20.00, 45, 20, 'Yoga', '/images/gallery/DSC_4870.JPG', 'published'),

-- Ice Bathing
('Ice Bath Session', 'Ledena kopel', 'IJsbad Sessie', 'Eisbad Session',
 'Guided cold therapy session with breathing exercises and recovery protocol',
 'Vodena hladna terapija z dihalnimi vajami in protokolom okrevanja',
 'Begeleide koudetherapie sessie met ademhalingsoefeningen en herstelprotocol',
 'Geführte Kältetherapie-Sitzung mit Atemübungen und Erholungsprotokoll',
 30.00, 30, 10, 'Ice Bathing', '/images/icebath breathing/DSC_4910.JPG', 'published'),

-- Workshops
('Breathwork Workshop', 'Delavnica dihanja', 'Ademhalingsworkshop', 'Atemarbeit Workshop',
 'Learn advanced breathing techniques for stress relief and energy',
 'Naučite se naprednih dihalnih tehnik za lajšanje stresa in energijo',
 'Leer geavanceerde ademhalingstechnieken voor stressverlichting en energie',
 'Lernen Sie fortgeschrittene Atemtechniken für Stressbewältigung und Energie',
 45.00, 90, 12, 'Workshops', '/images/gallery/DSC_4886.JPG', 'published'),

-- Packages
('Weekend Wellness Package', 'Vikend wellness paket', 'Weekend Wellness Pakket', 'Wochenend Wellness Paket',
 '2-day package including yoga, ice bathing, meals, and accommodation',
 '2-dnevni paket vključuje jogo, ledene kopeli, obroke in nastanitev',
 '2-daags pakket inclusief yoga, ijsbaden, maaltijden en accommodatie',
 '2-Tages-Paket mit Yoga, Eisbaden, Mahlzeiten und Unterkunft',
 299.00, NULL, 8, 'Packages', '/images/gallery/DSC_4906.JPG', 'published');

-- ================================================
-- MENU ITEMS SEED DATA
-- ================================================
INSERT INTO menu_items (name_en, name_sl, name_nl, name_de, description_en, description_sl, description_nl, description_de, price, ingredients_en, ingredients_sl, ingredients_nl, ingredients_de, allergens, category, image_url, stock, status) VALUES
-- Meals
('Protein Bowl', 'Beljakovinska skleda', 'Eiwit Bowl', 'Protein Schüssel',
 'Healthy bowl with quinoa, avocado, and roasted veggies',
 'Zdrava skleda s kvinojo, avokadom in pečeno zelenjavo',
 'Gezonde bowl met quinoa, avocado en geroosterde groente',
 'Gesunde Bowl mit Quinoa, Avocado und geröstetem Gemüse',
 9.90, 'quinoa, avocado, veggies', 'kvinoja, avokado, zelenjava', 'quinoa, avocado, groenten', 'Quinoa, Avocado, Gemüse',
 ARRAY['Nuts'], 'Meals', '/images/izbrane hrana/DSC_4870.JPG', 12, 'published'),

('Buddha Bowl', 'Buddha skleda', 'Buddha Bowl', 'Buddha Schüssel',
 'Colorful bowl packed with superfoods and plant protein',
 'Pisana skleda, polna superfoodov in rastlinskih beljakovin',
 'Kleurrijke bowl gevuld met superfoods en plantaardig eiwit',
 'Bunte Schüssel voller Superfoods und pflanzlichem Protein',
 11.50, 'chickpeas, kale, sweet potato, tahini', 'čičerika, ohrovt, sladki krompir, tahini', 'kikkererwten, boerenkool, zoete aardappel, tahini', 'Kichererbsen, Grünkohl, Süßkartoffel, Tahini',
 ARRAY['Sesame'], 'Meals', '/images/izbrane hrana/DSC_4872.JPG', 10, 'published'),

-- Beverages
('Energy Smoothie', 'Energijski smoothie', 'Energie Smoothie', 'Energie Smoothie',
 'Banana, spinach, oat milk, and chia seeds',
 'Banana, špinača, ovseno mleko in chia semena',
 'Banaan, spinazie, havermelk en chiazaad',
 'Banane, Spinat, Hafermilch und Chiasamen',
 4.90, 'banana, spinach, oat milk, chia', 'banana, špinača, ovseno mleko, chia', 'banaan, spinazie, havermelk, chia', 'Banane, Spinat, Hafermilch, Chia',
 ARRAY[]::TEXT[], 'Beverages', '/images/izbrane hrana/DSC_4890.JPG', 25, 'published'),

('Green Detox Juice', 'Zeleni detoks sok', 'Groene Detox Sap', 'Grüner Detox Saft',
 'Fresh pressed juice with cucumber, celery, and ginger',
 'Sveže stiskan sok s kumaro, zeleno in ingverjem',
 'Vers geperst sap met komkommer, selderij en gember',
 'Frisch gepresster Saft mit Gurke, Sellerie und Ingwer',
 5.50, 'cucumber, celery, ginger, lemon', 'kumara, zelena, ingver, limona', 'komkommer, selderij, gember, citroen', 'Gurke, Sellerie, Ingwer, Zitrone',
 ARRAY[]::TEXT[], 'Beverages', '/images/izbrane hrana/DSC_4886.JPG', 15, 'published'),

-- Snacks
('Nut Mix Snack', 'Oreščki mix', 'Notenmix', 'Nussmix',
 'Roasted nuts with dried fruits',
 'Praženi oreščki s suhim sadjem',
 'Geroosterde noten met gedroogd fruit',
 'Geröstete Nüsse mit Trockenfrüchten',
 3.50, 'nuts, raisins', 'oreščki, rozine', 'noten, rozijnen', 'Nüsse, Rosinen',
 ARRAY['Nuts'], 'Snacks', '/images/izbrane hrana/DSC_4866.JPG', 50, 'published'),

('Energy Balls', 'Energijske kroglice', 'Energie Balletjes', 'Energie Bällchen',
 'Homemade energy balls with dates, nuts, and cacao',
 'Domače energijske kroglice z datelji, oreški in kakavom',
 'Zelfgemaakte energieballetjes met dadels, noten en cacao',
 'Hausgemachte Energiekugeln mit Datteln, Nüssen und Kakao',
 4.20, 'dates, almonds, cacao, coconut', 'datlji, mandlji, kakav, kokos', 'dadels, amandelen, cacao, kokos', 'Datteln, Mandeln, Kakao, Kokosnuss',
 ARRAY['Nuts'], 'Snacks', '/images/izbrane hrana/DSC_4906.JPG', 30, 'published');

-- ================================================
-- SCHEDULES SEED DATA
-- ================================================
INSERT INTO schedules (day_of_week, time, service_id, instructor, capacity) 
SELECT 
  day_of_week,
  time::TIME,
  (SELECT id FROM services WHERE name_en = service_name LIMIT 1),
  instructor,
  capacity
FROM (VALUES
  -- Monday
  (1, '07:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (1, '10:00', 'Ice Bath Session', 'Marko Horvat', 10),
  (1, '18:00', 'Sunset Meditation', 'Ana Novak', 20),
  
  -- Tuesday
  (2, '07:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (2, '14:00', 'Breathwork Workshop', 'Luka Kovač', 12),
  (2, '18:00', 'Sunset Meditation', 'Ana Novak', 20),
  
  -- Wednesday
  (3, '07:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (3, '10:00', 'Ice Bath Session', 'Marko Horvat', 10),
  (3, '18:00', 'Sunset Meditation', 'Ana Novak', 20),
  
  -- Thursday
  (4, '07:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (4, '14:00', 'Breathwork Workshop', 'Luka Kovač', 12),
  (4, '18:00', 'Sunset Meditation', 'Ana Novak', 20),
  
  -- Friday
  (5, '07:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (5, '10:00', 'Ice Bath Session', 'Marko Horvat', 10),
  (5, '18:00', 'Sunset Meditation', 'Ana Novak', 20),
  
  -- Saturday
  (6, '08:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (6, '11:00', 'Ice Bath Session', 'Marko Horvat', 10),
  (6, '14:00', 'Breathwork Workshop', 'Luka Kovač', 12),
  (6, '17:00', 'Sunset Meditation', 'Ana Novak', 20),
  
  -- Sunday
  (0, '09:00', 'Morning Yoga Flow', 'Ana Novak', 15),
  (0, '17:00', 'Sunset Meditation', 'Ana Novak', 20)
) AS t(day_of_week, time, service_name, instructor, capacity);

-- ================================================
-- GALLERY IMAGES SEED DATA
-- ================================================
INSERT INTO gallery_images (title_en, title_sl, title_nl, title_de, image_url, category, order_index, status) VALUES
('Wellness Retreat', 'Wellness Retreat', 'Wellness Retreat', 'Wellness Retreat', '/images/gallery/DSC_4866.JPG', 'gallery', 1, 'published'),
('Healthy Food', 'Zdrava hrana', 'Gezond eten', 'Gesundes Essen', '/images/gallery/DSC_4870.JPG', 'gallery', 2, 'published'),
('Nature Setting', 'Naravno okolje', 'Natuurlijke omgeving', 'Natürliche Umgebung', '/images/gallery/DSC_4872.JPG', 'gallery', 3, 'published'),
('Wellness Activities', 'Wellness aktivnosti', 'Wellness activiteiten', 'Wellness-Aktivitäten', '/images/gallery/DSC_4886.JPG', 'gallery', 4, 'published'),
('Healthy Beverages', 'Zdrave pijače', 'Gezonde dranken', 'Gesunde Getränke', '/images/gallery/DSC_4890.JPG', 'gallery', 5, 'published'),
('Mountain Views', 'Razgledi na gore', 'Berg uitzichten', 'Bergblicke', '/images/gallery/DSC_4906.JPG', 'gallery', 6, 'published'),
('Ice Bathing', 'Ledena kopel', 'IJsbaden', 'Eisbaden', '/images/gallery/DSC_4910.JPG', 'icebath', 7, 'published'),
('Retreat Atmosphere', 'Atmosfera retreata', 'Retreat sfeer', 'Retreat-Atmosphäre', '/images/gallery/DSC_4915.JPG', 'gallery', 8, 'published');

-- ================================================
-- TESTIMONIALS SEED DATA
-- ================================================
INSERT INTO testimonials (name, rating, comment_en, comment_sl, comment_nl, comment_de, status) VALUES
('Sarah M.', 5, 
 'Life-changing experience! The combination of yoga and ice bathing transformed my wellness journey.',
 'Izkušnja, ki spremeni življenje! Kombinacija joge in ledenih kopeli je spremenila mojo pot dobrega počutja.',
 'Levensveranderende ervaring! De combinatie van yoga en ijsbaden transformeerde mijn welzijnsreis.',
 'Lebensverändernde Erfahrung! Die Kombination aus Yoga und Eisbaden hat meine Wellness-Reise verändert.',
 'approved'),

('David K.', 5,
 'Amazing retreat in the heart of nature. The instructors are professional and the food is incredible.',
 'Neverjetno zatočišče v srcu narave. Inštruktorji so profesionalni, hrana pa neverjetna.',
 'Geweldige retreat in het hart van de natuur. De instructeurs zijn professioneel en het eten is ongelooflijk.',
 'Erstaunlicher Rückzugsort im Herzen der Natur. Die Instruktoren sind professionell und das Essen ist unglaublich.',
 'approved'),

('Maria L.', 4,
 'Peaceful setting with excellent facilities. Would definitely recommend to anyone seeking wellness.',
 'Mirno okolje z odličnimi napravami. Bi jo priporočil vsakomur, ki išče dobro počutje.',
 'Vredige omgeving met uitstekende faciliteiten. Zou het zeker aanraden aan iedereen die welzijn zoekt.',
 'Friedliche Umgebung mit hervorragenden Einrichtungen. Würde es jedem empfehlen, der Wellness sucht.',
 'approved');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Services: %, Menu Items: %, Schedules: %, Gallery Images: %, Testimonials: %',
    (SELECT COUNT(*) FROM services),
    (SELECT COUNT(*) FROM menu_items),
    (SELECT COUNT(*) FROM schedules),
    (SELECT COUNT(*) FROM gallery_images),
    (SELECT COUNT(*) FROM testimonials);
END $$;
