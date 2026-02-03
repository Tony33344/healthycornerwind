-- Real data population for Healthy Corner Wellness Platform
-- This script populates all tables with realistic data for testing

-- Clear existing data
DELETE FROM bookings;
DELETE FROM schedules;
DELETE FROM services;
DELETE FROM menu_items;
DELETE FROM newsletter_subscribers;
DELETE FROM contact_messages;

-- Insert real services
INSERT INTO services (id, name_sl, name_en, name_nl, name_de, description_sl, description_en, description_nl, description_de, price, duration, capacity, category, image_url, status) VALUES
('srv_001', 'Jutranja Joga', 'Morning Yoga', 'Ochtend Yoga', 'Morgen Yoga', 'Sproščujoča jutranja joga v naravi z razgledom na Alpe', 'Relaxing morning yoga in nature with Alpine views', 'Ontspannende ochtendyoga in de natuur met uitzicht op de Alpen', 'Entspannende Morgen-Yoga in der Natur mit Alpenblick', 25.00, 60, 12, 'Yoga', '/images/services/morning-yoga.jpg', 'published'),
('srv_002', 'Ledene Kopeli', 'Ice Bathing', 'IJsbaden', 'Eisbaden', 'Terapevtske ledene kopeli za krepitev imunskega sistema', 'Therapeutic ice baths for immune system strengthening', 'Therapeutische ijsbaden voor versterking van het immuunsysteem', 'Therapeutische Eisbäder zur Stärkung des Immunsystems', 35.00, 45, 8, 'Ice Bathing', '/images/services/ice-bathing.jpg', 'published'),
('srv_003', 'Dihalne Tehnike', 'Breathing Workshop', 'Ademhalingsworkshop', 'Atemtechnik Workshop', 'Učenje naprednih dihalnih tehnik za stresno upravljanje', 'Learning advanced breathing techniques for stress management', 'Geavanceerde ademhalingstechnieken leren voor stressmanagement', 'Erlernen fortgeschrittener Atemtechniken für Stressmanagement', 40.00, 90, 15, 'Workshops', '/images/services/breathing.jpg', 'published'),
('srv_004', 'Wellness Paket - Celodnevni', 'Full Day Wellness Package', 'Volledige Dag Wellness Pakket', 'Ganztägiges Wellness-Paket', 'Celodnevni program z jogo, ledenimi kopelmi in zdravo prehrano', 'Full day program with yoga, ice baths and healthy nutrition', 'Volledige dagprogramma met yoga, ijsbaden en gezonde voeding', 'Ganztägiges Programm mit Yoga, Eisbädern und gesunder Ernährung', 120.00, 480, 10, 'Packages', '/images/services/full-day.jpg', 'published'),
('srv_005', 'Meditacija ob Sončnem Vzhodu', 'Sunrise Meditation', 'Zonsopgang Meditatie', 'Sonnenaufgang Meditation', 'Mirna meditacija ob prvem sončnem žarku', 'Peaceful meditation at first sunlight', 'Vredige meditatie bij het eerste zonlicht', 'Friedliche Meditation beim ersten Sonnenlicht', 20.00, 45, 20, 'Yoga', '/images/services/sunrise-meditation.jpg', 'published'),
('srv_006', 'Vikend Retreat', 'Weekend Retreat', 'Weekend Retraite', 'Wochenend-Retreat', 'Dvodnevni wellness program s prenočitvijo', 'Two-day wellness program with accommodation', 'Tweedaags wellnessprogramma met accommodatie', 'Zweitägiges Wellness-Programm mit Unterkunft', 280.00, 2880, 8, 'Packages', '/images/services/weekend-retreat.jpg', 'published');

-- Insert realistic schedules for the next 30 days
INSERT INTO schedules (id, service_id, day_of_week, start_time, end_time, instructor_name, max_participants, available_spots, is_active) VALUES
-- Morning Yoga (Monday to Friday)
('sch_001', 'srv_001', 1, '07:00', '08:00', 'Ana Novak', 12, 8, true),
('sch_002', 'srv_001', 2, '07:00', '08:00', 'Ana Novak', 12, 5, true),
('sch_003', 'srv_001', 3, '07:00', '08:00', 'Ana Novak', 12, 10, true),
('sch_004', 'srv_001', 4, '07:00', '08:00', 'Ana Novak', 12, 7, true),
('sch_005', 'srv_001', 5, '07:00', '08:00', 'Ana Novak', 12, 9, true),

-- Ice Bathing (Daily)
('sch_006', 'srv_002', 1, '09:00', '09:45', 'Marko Petrič', 8, 3, true),
('sch_007', 'srv_002', 1, '16:00', '16:45', 'Marko Petrič', 8, 6, true),
('sch_008', 'srv_002', 2, '09:00', '09:45', 'Marko Petrič', 8, 4, true),
('sch_009', 'srv_002', 2, '16:00', '16:45', 'Marko Petrič', 8, 5, true),
('sch_010', 'srv_002', 3, '09:00', '09:45', 'Marko Petrič', 8, 2, true),
('sch_011', 'srv_002', 3, '16:00', '16:45', 'Marko Petrič', 8, 7, true),
('sch_012', 'srv_002', 4, '09:00', '09:45', 'Marko Petrič', 8, 1, true),
('sch_013', 'srv_002', 4, '16:00', '16:45', 'Marko Petrič', 8, 8, true),
('sch_014', 'srv_002', 5, '09:00', '09:45', 'Marko Petrič', 8, 6, true),
('sch_015', 'srv_002', 5, '16:00', '16:45', 'Marko Petrič', 8, 4, true),
('sch_016', 'srv_002', 6, '10:00', '10:45', 'Marko Petrič', 8, 5, true),
('sch_017', 'srv_002', 6, '15:00', '15:45', 'Marko Petrič', 8, 3, true),
('sch_018', 'srv_002', 0, '10:00', '10:45', 'Marko Petrič', 8, 7, true),
('sch_019', 'srv_002', 0, '15:00', '15:45', 'Marko Petrič', 8, 2, true),

-- Breathing Workshop (Tuesday, Thursday, Saturday)
('sch_020', 'srv_003', 2, '14:00', '15:30', 'Sara Kos', 15, 12, true),
('sch_021', 'srv_003', 4, '14:00', '15:30', 'Sara Kos', 15, 8, true),
('sch_022', 'srv_003', 6, '11:00', '12:30', 'Sara Kos', 15, 10, true),

-- Sunrise Meditation (Daily)
('sch_023', 'srv_005', 1, '06:00', '06:45', 'Petra Golob', 20, 15, true),
('sch_024', 'srv_005', 2, '06:00', '06:45', 'Petra Golob', 20, 18, true),
('sch_025', 'srv_005', 3, '06:00', '06:45', 'Petra Golob', 20, 12, true),
('sch_026', 'srv_005', 4, '06:00', '06:45', 'Petra Golob', 20, 16, true),
('sch_027', 'srv_005', 5, '06:00', '06:45', 'Petra Golob', 20, 14, true),
('sch_028', 'srv_005', 6, '06:30', '07:15', 'Petra Golob', 20, 17, true),
('sch_029', 'srv_005', 0, '06:30', '07:15', 'Petra Golob', 20, 13, true),

-- Weekend Retreat (Friday to Sunday)
('sch_030', 'srv_006', 5, '15:00', '15:00', 'Ana Novak & Team', 8, 3, true);

-- Insert realistic menu items
INSERT INTO menu_items (id, name_sl, name_en, name_nl, name_de, description_sl, description_en, description_nl, description_de, price, ingredients_sl, ingredients_en, ingredients_nl, ingredients_de, allergens, category, image_url, stock, status) VALUES
-- Healthy Meals
('menu_001', 'Alpska Zdrava Skleda', 'Alpine Healthy Bowl', 'Alpine Gezonde Bowl', 'Alpine Gesunde Schüssel', 'Hranljiva skleda z lokalnimi sestavinami', 'Nutritious bowl with local ingredients', 'Voedzame bowl met lokale ingrediënten', 'Nahrhafte Schüssel mit lokalen Zutaten', 14.50, 'Kvinoja, avokado, rdeča pesa, orehi, olivno olje', 'Quinoa, avocado, beetroot, walnuts, olive oil', 'Quinoa, avocado, rode biet, walnoten, olijfolie', 'Quinoa, Avocado, Rote Bete, Walnüsse, Olivenöl', '["nuts"]', 'Meals', '/images/menu/alpine-bowl.jpg', 25, 'published'),

('menu_002', 'Planinski Wrap', 'Mountain Wrap', 'Berg Wrap', 'Berg Wrap', 'Polnozrnati wrap z zelenjavo in humusom', 'Whole grain wrap with vegetables and hummus', 'Volkoren wrap met groenten en hummus', 'Vollkorn-Wrap mit Gemüse und Hummus', 12.00, 'Polnozrnata tortilja, hummus, paprika, kumare, paradižnik', 'Whole grain tortilla, hummus, peppers, cucumber, tomato', 'Volkoren tortilla, hummus, paprika, komkommer, tomaat', 'Vollkorn-Tortilla, Hummus, Paprika, Gurke, Tomate', '["gluten"]', 'Meals', '/images/menu/mountain-wrap.jpg', 30, 'published'),

('menu_003', 'Wellness Solata', 'Wellness Salad', 'Wellness Salade', 'Wellness Salat', 'Sveža mešana solata s superživili', 'Fresh mixed salad with superfoods', 'Verse gemengde salade met superfoods', 'Frischer gemischter Salat mit Superfoods', 13.50, 'Mešane zelene solate, chia semena, goji jagode, feta sir', 'Mixed greens, chia seeds, goji berries, feta cheese', 'Gemengde sla, chiazaad, gojibessen, feta kaas', 'Gemischte Blattsalate, Chiasamen, Goji-Beeren, Feta-Käse', '["dairy"]', 'Meals', '/images/menu/wellness-salad.jpg', 20, 'published'),

-- Healthy Snacks
('menu_004', 'Energijske Kroglice', 'Energy Balls', 'Energie Balletjes', 'Energie Bällchen', 'Naravne energijske kroglice z datlji in orehi', 'Natural energy balls with dates and nuts', 'Natuurlijke energieballetjes met dadels en noten', 'Natürliche Energiekugeln mit Datteln und Nüssen', 6.50, 'Datlji, mandlji, kakav, kokos', 'Dates, almonds, cacao, coconut', 'Dadels, amandelen, cacao, kokos', 'Datteln, Mandeln, Kakao, Kokosnuss', '["nuts"]', 'Snacks', '/images/menu/energy-balls.jpg', 50, 'published'),

('menu_005', 'Alpski Med', 'Alpine Honey', 'Alpine Honing', 'Alpenhonig', 'Lokalni alpski med iz naših čebelnjakov', 'Local alpine honey from our apiaries', 'Lokale alpenhoning van onze bijenkorven', 'Lokaler Alpenhonig aus unseren Bienenstöcken', 8.00, '100% čisti alpski med', '100% pure alpine honey', '100% pure alpenhoning', '100% reiner Alpenhonig', '[]', 'Snacks', '/images/menu/alpine-honey.jpg', 15, 'published'),

-- Healthy Beverages
('menu_006', 'Zeleni Smoothie', 'Green Smoothie', 'Groene Smoothie', 'Grüner Smoothie', 'Osvežujoč zeleni smoothie z špinačo in sadjem', 'Refreshing green smoothie with spinach and fruit', 'Verfrissende groene smoothie met spinazie en fruit', 'Erfrischender grüner Smoothie mit Spinat und Obst', 7.50, 'Špinača, banana, mango, kokosovo mleko', 'Spinach, banana, mango, coconut milk', 'Spinazie, banaan, mango, kokosmelk', 'Spinat, Banane, Mango, Kokosmilch', '[]', 'Beverages', '/images/menu/green-smoothie.jpg', 40, 'published'),

('menu_007', 'Zlati Latte', 'Golden Latte', 'Gouden Latte', 'Goldene Latte', 'Kurkuma latte z mandljevim mlekom', 'Turmeric latte with almond milk', 'Kurkuma latte met amandelmelk', 'Kurkuma-Latte mit Mandelmilch', 5.50, 'Kurkuma, mandljevo mleko, med, cimet', 'Turmeric, almond milk, honey, cinnamon', 'Kurkuma, amandelmelk, honing, kaneel', 'Kurkuma, Mandelmilch, Honig, Zimt', '["nuts"]', 'Beverages', '/images/menu/golden-latte.jpg', 35, 'published'),

('menu_008', 'Planinski Čaj', 'Mountain Tea', 'Berg Thee', 'Bergtee', 'Mešanica alpskih zelišč za sproščanje', 'Alpine herb blend for relaxation', 'Alpine kruidenmix voor ontspanning', 'Alpine Kräutermischung zur Entspannung', 4.00, 'Kamilica, melisa, meta, sivka', 'Chamomile, lemon balm, mint, lavender', 'Kamille, citroenmelisse, munt, lavendel', 'Kamille, Zitronenmelisse, Minze, Lavendel', '[]', 'Beverages', '/images/menu/mountain-tea.jpg', 60, 'published'),

-- Supplements
('menu_009', 'Vitamin D3 + K2', 'Vitamin D3 + K2', 'Vitamine D3 + K2', 'Vitamin D3 + K2', 'Naravni vitamin D3 s K2 za kosti', 'Natural vitamin D3 with K2 for bones', 'Natuurlijke vitamine D3 met K2 voor botten', 'Natürliches Vitamin D3 mit K2 für Knochen', 24.90, 'Vitamin D3, vitamin K2, MCT olje', 'Vitamin D3, vitamin K2, MCT oil', 'Vitamine D3, vitamine K2, MCT olie', 'Vitamin D3, Vitamin K2, MCT-Öl', '[]', 'Supplements', '/images/menu/vitamin-d3.jpg', 25, 'published'),

('menu_010', 'Omega-3 Kapsule', 'Omega-3 Capsules', 'Omega-3 Capsules', 'Omega-3 Kapseln', 'Visokokakovostne omega-3 maščobne kisline', 'High-quality omega-3 fatty acids', 'Hoogwaardige omega-3 vetzuren', 'Hochwertige Omega-3-Fettsäuren', 32.50, 'Ribje olje, vitamin E', 'Fish oil, vitamin E', 'Visolie, vitamine E', 'Fischöl, Vitamin E', '["fish"]', 'Supplements', '/images/menu/omega-3.jpg', 20, 'published');

-- Insert sample bookings
INSERT INTO bookings (id, schedule_id, booking_date, customer_name, customer_email, customer_phone, notes, status, created_at) VALUES
('book_001', 'sch_001', '2025-01-15', 'Maja Novak', 'maja.novak@email.si', '+386 40 123 456', 'Prva joga izkušnja', 'confirmed', NOW() - INTERVAL '2 days'),
('book_002', 'sch_006', '2025-01-15', 'Luka Horvat', 'luka.horvat@email.si', '+386 41 234 567', '', 'confirmed', NOW() - INTERVAL '1 day'),
('book_003', 'sch_020', '2025-01-16', 'Ana Zupan', 'ana.zupan@email.si', '+386 42 345 678', 'Zanima me napredna tehnika', 'pending', NOW() - INTERVAL '3 hours'),
('book_004', 'sch_023', '2025-01-17', 'Marko Kralj', 'marko.kralj@email.si', '+386 43 456 789', '', 'confirmed', NOW() - INTERVAL '1 hour'),
('book_005', 'sch_030', '2025-01-19', 'Petra Mlakar', 'petra.mlakar@email.si', '+386 44 567 890', 'Rezervacija za dva', 'confirmed', NOW() - INTERVAL '30 minutes');

-- Insert newsletter subscribers
INSERT INTO newsletter_subscribers (email, status, subscribed_at, created_at) VALUES
('maja.novak@email.si', 'active', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('luka.horvat@email.si', 'active', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('ana.zupan@email.si', 'active', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('marko.kralj@email.si', 'active', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('petra.mlakar@email.si', 'active', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
('test.user@example.com', 'active', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours');

-- Insert contact messages
INSERT INTO contact_messages (name, email, phone, message, status, created_at) VALUES
('Janez Novak', 'janez.novak@email.si', '+386 40 111 222', 'Zanima me vikend retreat program. Ali imate prosta mesta za naslednji mesec?', 'new', NOW() - INTERVAL '2 hours'),
('Sara Kovač', 'sara.kovac@email.si', '+386 41 333 444', 'Rad bi izvedel več o ledenih kopelih. Ali so primerne za začetnike?', 'new', NOW() - INTERVAL '4 hours'),
('Miha Zupančič', 'miha.zupancic@email.si', '', 'Odličen program! Hvala za čudovito izkušnjo prejšnji teden.', 'read', NOW() - INTERVAL '1 day'),
('Eva Petrič', 'eva.petric@email.si', '+386 42 555 666', 'Ali imate možnost organizacije skupinskih programov za podjetja?', 'new', NOW() - INTERVAL '30 minutes');

-- Update available spots based on bookings
UPDATE schedules SET available_spots = max_participants - 1 WHERE id IN ('sch_001', 'sch_006', 'sch_020', 'sch_023');
UPDATE schedules SET available_spots = max_participants - 2 WHERE id = 'sch_030';

COMMIT;
