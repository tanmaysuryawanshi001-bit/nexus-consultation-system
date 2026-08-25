-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'consultant') NOT NULL,
  avatar_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Consultant Profiles Table
CREATE TABLE IF NOT EXISTS consultant_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  headline VARCHAR(255),
  hourly_rate DECIMAL(10,2) NOT NULL,
  experience_years INT NOT NULL,
  bio TEXT,
  rating_avg DECIMAL(3,2) DEFAULT 5.00,
  is_verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create Specializations Table
CREATE TABLE IF NOT EXISTS specializations (
  id VARCHAR(36) PRIMARY KEY,
  consultant_id VARCHAR(36) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tag_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (consultant_id) REFERENCES consultant_profiles(id) ON DELETE CASCADE
);

-- 4. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  consultant_id VARCHAR(36) NOT NULL,
  session_date DATETIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  meeting_link VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (consultant_id) REFERENCES consultant_profiles(id) ON DELETE CASCADE
);

-- 5. Seed Consultants & Users
INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES
('u1', 'James D.', 'james@connect.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'consultant', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('u2', 'Sarah K.', 'sarah@connect.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'consultant', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
('u3', 'Dr. Elena Rostova', 'elena@connect.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'consultant', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('u4', 'Marcus Chen', 'marcus@connect.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'consultant', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('u5', 'Ananya Sharma', 'ananya@connect.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'consultant', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
('u6', 'David Miller', 'david@connect.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'consultant', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO consultant_profiles (id, user_id, headline, hourly_rate, experience_years, bio, rating_avg, is_verified) VALUES
('c1', 'u1', 'Senior Full-Stack Cloud Architect & Microservices Specialist', 150.00, 12, 'Ex-FAANG Principal Engineer with 12+ years building enterprise SaaS and high-throughput microservices.', 4.95, TRUE),
('c2', 'u2', 'Product Strategy Lead & Startup Advisor', 120.00, 9, 'Helped 30+ startups scale from seed to Series B. Expert in growth metrics and UI/UX conversion rate optimization.', 4.88, TRUE),
('c3', 'u3', 'Applied AI/ML Researcher & LLM Systems Engineer', 180.00, 10, 'PhD in Computer Science. Consults on custom LLM fine-tuning, RAG pipelines, and scalable vector search architectures.', 5.00, TRUE),
('c4', 'u4', 'Fintech Security Architect & Compliance Auditor', 160.00, 11, 'Specialized in zero-trust architecture, PCI-DSS compliance, and cloud security posture audits.', 4.92, TRUE),
('c5', 'u5', 'Executive Career Coach & Tech Leadership Mentor', 95.00, 8, 'Former Director of Engineering mentoring engineers into staff+ and executive roles.', 4.85, TRUE),
('c6', 'u6', 'Fractional CFO & Venture Capital Strategist', 200.00, 14, 'Guiding founders on unit economics, financial modeling, and venture capital fundraising rounds.', 4.98, TRUE)
ON DUPLICATE KEY UPDATE headline=VALUES(headline);

INSERT INTO specializations (id, consultant_id, category, tag_name) VALUES
('s1', 'c1', 'tech', 'Cloud Architecture'),
('s2', 'c1', 'tech', 'System Design'),
('s3', 'c1', 'tech', 'Node.js'),
('s4', 'c2', 'business', 'Product Strategy'),
('s5', 'c2', 'business', 'Growth Marketing'),
('s6', 'c3', 'tech', 'Generative AI'),
('s7', 'c3', 'tech', 'Machine Learning'),
('s8', 'c4', 'security', 'Cloud Security'),
('s9', 'c4', 'security', 'Compliance'),
('s10', 'c5', 'career', 'Leadership Coaching'),
('s11', 'c6', 'finance', 'Venture Capital')
ON DUPLICATE KEY UPDATE tag_name=VALUES(tag_name);