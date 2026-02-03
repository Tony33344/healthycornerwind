-- Add sample services (adjust column names based on your actual schema)
INSERT INTO services (name, description, duration_minutes, price_eur, max_guests) VALUES
('Morning Yoga', 'Start your day with energizing yoga', 60, 25.00, 10),
('Ice Bathing', 'Cold therapy for wellness', 45, 35.00, 6),
('Wellness Workshop', 'Holistic wellness experience', 90, 45.00, 12);

-- Add sample schedules (adjust column names based on your actual schema)
INSERT INTO schedules (service_id, day_of_week, time, capacity) 
SELECT 
    s.id,
    1, -- Monday
    '09:00'::time,
    s.max_guests
FROM services s WHERE s.name = 'Morning Yoga';

INSERT INTO schedules (service_id, day_of_week, time, capacity) 
SELECT 
    s.id,
    1, -- Monday  
    '11:00'::time,
    s.max_guests
FROM services s WHERE s.name = 'Ice Bathing';

INSERT INTO schedules (service_id, day_of_week, time, capacity) 
SELECT 
    s.id,
    3, -- Wednesday
    '18:00'::time,
    s.max_guests
FROM services s WHERE s.name = 'Wellness Workshop';
