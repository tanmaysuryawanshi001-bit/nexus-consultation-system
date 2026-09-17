-- Adds two repeatable demo consultants. Run in Railway's MySQL query console.
USE connect_db;
START TRANSACTION;

INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES
  ('demo-consultant-01', 'Maya Patel', 'maya.demo@connect.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'consultant', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'),
  ('demo-consultant-02', 'Daniel Brooks', 'daniel.demo@connect.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'consultant', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400')
ON DUPLICATE KEY UPDATE name = VALUES(name), avatar_url = VALUES(avatar_url);

INSERT INTO consultant_profiles (id, user_id, headline, hourly_rate, experience_years, bio, rating_avg, is_verified) VALUES
  ('demo-consultant-profile-01', 'demo-consultant-01', 'Career Transition Coach & Interview Specialist', 85.00, 7, 'Helps professionals move into new careers with practical interview preparation, positioning, and confidence-building plans.', 4.90, TRUE),
  ('demo-consultant-profile-02', 'demo-consultant-02', 'Learning Strategist & Education Mentor', 75.00, 6, 'Supports students and lifelong learners with study systems, goal planning, and personalized education roadmaps.', 4.87, TRUE)
ON DUPLICATE KEY UPDATE headline = VALUES(headline), hourly_rate = VALUES(hourly_rate), bio = VALUES(bio), rating_avg = VALUES(rating_avg), is_verified = VALUES(is_verified);

INSERT INTO specializations (id, consultant_id, category, tag_name) VALUES
  ('demo-specialization-01', 'demo-consultant-profile-01', 'career', 'Interview Preparation'),
  ('demo-specialization-02', 'demo-consultant-profile-01', 'career', 'Career Transition'),
  ('demo-specialization-03', 'demo-consultant-profile-01', 'career', 'Resume Strategy'),
  ('demo-specialization-04', 'demo-consultant-profile-02', 'education', 'Study Planning'),
  ('demo-specialization-05', 'demo-consultant-profile-02', 'education', 'Learning Strategy'),
  ('demo-specialization-06', 'demo-consultant-profile-02', 'education', 'Academic Mentoring')
ON DUPLICATE KEY UPDATE category = VALUES(category), tag_name = VALUES(tag_name);

COMMIT;
