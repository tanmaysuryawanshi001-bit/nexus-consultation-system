-- Switch to your project database
USE connect_db;

-- 1. Check all project tables
SHOW TABLES;

-- 2. View all registered users
SELECT id, name, email, role, created_at FROM users;

-- 3. View consultant profiles
SELECT 
    cp.id AS consultant_id,
    u.name, 
    cp.headline, 
    cp.hourly_rate, 
    cp.rating_avg,
    cp.is_verified
FROM consultant_profiles cp
JOIN users u ON cp.user_id = u.id;

-- 4. View scheduled bookings
SELECT 
    b.id AS booking_id,
    u.name AS client_name,
    b.session_date,
    b.duration_minutes,
    b.total_price,
    b.status
FROM bookings b
JOIN users u ON b.client_id = u.id;