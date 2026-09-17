-- Adds two repeatable demo consultants to Railway MySQL.
-- Run while the console shows a `mysql>` prompt.
USE connect_db;

SET @category_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'specializations' AND COLUMN_NAME = 'category');
SET @add_category_sql = IF(@category_column_exists = 0, 'ALTER TABLE specializations ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT ''career''', 'SELECT 1');
PREPARE add_category_statement FROM @add_category_sql;
EXECUTE add_category_statement;
DEALLOCATE PREPARE add_category_statement;

START TRANSACTION;

INSERT INTO users (name, email, password_hash, role, avatar_url)
SELECT 'Maya Patel', 'maya.demo@connect.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'consultant', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'maya.demo@connect.com');
INSERT INTO users (name, email, password_hash, role, avatar_url)
SELECT 'Daniel Brooks', 'daniel.demo@connect.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'consultant', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'daniel.demo@connect.com');

INSERT INTO consultant_profiles (user_id, headline, hourly_rate, experience_years, bio, rating_avg, is_verified)
SELECT id, 'Career Transition Coach & Interview Specialist', 85.00, 7, 'Helps professionals move into new careers with practical interview preparation, positioning, and confidence-building plans.', 4.90, TRUE FROM users WHERE email = 'maya.demo@connect.com' AND NOT EXISTS (SELECT 1 FROM consultant_profiles cp JOIN users u ON u.id = cp.user_id WHERE u.email = 'maya.demo@connect.com');
INSERT INTO consultant_profiles (user_id, headline, hourly_rate, experience_years, bio, rating_avg, is_verified)
SELECT id, 'Learning Strategist & Education Mentor', 75.00, 6, 'Supports students and lifelong learners with study systems, goal planning, and personalized education roadmaps.', 4.87, TRUE FROM users WHERE email = 'daniel.demo@connect.com' AND NOT EXISTS (SELECT 1 FROM consultant_profiles cp JOIN users u ON u.id = cp.user_id WHERE u.email = 'daniel.demo@connect.com');

INSERT INTO specializations (consultant_id, category, tag_name)
SELECT cp.id, 'career', 'Interview Preparation' FROM consultant_profiles cp JOIN users u ON u.id = cp.user_id WHERE u.email = 'maya.demo@connect.com' AND NOT EXISTS (SELECT 1 FROM specializations s WHERE s.consultant_id = cp.id AND s.tag_name = 'Interview Preparation');
INSERT INTO specializations (consultant_id, category, tag_name)
SELECT cp.id, 'career', 'Career Transition' FROM consultant_profiles cp JOIN users u ON u.id = cp.user_id WHERE u.email = 'maya.demo@connect.com' AND NOT EXISTS (SELECT 1 FROM specializations s WHERE s.consultant_id = cp.id AND s.tag_name = 'Career Transition');
INSERT INTO specializations (consultant_id, category, tag_name)
SELECT cp.id, 'education', 'Study Planning' FROM consultant_profiles cp JOIN users u ON u.id = cp.user_id WHERE u.email = 'daniel.demo@connect.com' AND NOT EXISTS (SELECT 1 FROM specializations s WHERE s.consultant_id = cp.id AND s.tag_name = 'Study Planning');
INSERT INTO specializations (consultant_id, category, tag_name)
SELECT cp.id, 'education', 'Learning Strategy' FROM consultant_profiles cp JOIN users u ON u.id = cp.user_id WHERE u.email = 'daniel.demo@connect.com' AND NOT EXISTS (SELECT 1 FROM specializations s WHERE s.consultant_id = cp.id AND s.tag_name = 'Learning Strategy');

COMMIT;
SELECT u.name, cp.headline, cp.is_verified FROM users u JOIN consultant_profiles cp ON cp.user_id = u.id WHERE u.email IN ('maya.demo@connect.com', 'daniel.demo@connect.com');
