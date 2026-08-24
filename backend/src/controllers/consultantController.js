const pool = require('../config/db');

exports.getConsultants = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = `
      SELECT 
        cp.id,
        u.id AS user_id,
        u.name,
        u.email,
        u.avatar_url,
        cp.headline,
        cp.hourly_rate,
        cp.experience_years,
        cp.bio,
        cp.rating_avg,
        cp.is_verified,
        GROUP_CONCAT(DISTINCT s.tag_name) AS skills_str
      FROM consultant_profiles cp
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN specializations s ON cp.id = s.consultant_id
      WHERE cp.is_verified = TRUE
    `;

    const queryParams = [];

    if (category && category.trim() !== '') {
      query += ` AND EXISTS (
        SELECT 1 FROM specializations sub_s 
        WHERE sub_s.consultant_id = cp.id AND sub_s.category = ?
      )`;
      queryParams.push(category);
    }

    if (search && search.trim() !== '') {
      query += ` AND (
        u.name LIKE ? OR 
        cp.headline LIKE ? OR 
        cp.bio LIKE ? OR 
        EXISTS (
          SELECT 1 FROM specializations sub_s2 
          WHERE sub_s2.consultant_id = cp.id AND sub_s2.tag_name LIKE ?
        )
      )`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ` GROUP BY cp.id, u.id ORDER BY cp.rating_avg DESC`;

    const [rows] = await pool.query(query, queryParams);

    const consultants = rows.map((row) => ({
      ...row,
      skills: row.skills_str ? row.skills_str.split(',') : [],
    }));

    return res.status(200).json({ success: true, count: consultants.length, data: consultants });
  } catch (error) {
    console.error('getConsultants Error:', error);
    return res.status(500).json({ error: 'Failed to fetch consultants.' });
  }
};

exports.applyConsultant = async (req, res) => {
  try {
    const userId = req.user.id;
    const { headline, hourlyRate, experienceYears, bio, category, skills } = req.body;

    const consultantId = `c_${Date.now()}`;

    await pool.query(
      `INSERT INTO consultant_profiles (id, user_id, headline, hourly_rate, experience_years, bio, is_verified, rating_avg)
       VALUES (?, ?, ?, ?, ?, ?, TRUE, 5.00)
       ON DUPLICATE KEY UPDATE headline = VALUES(headline), hourly_rate = VALUES(hourly_rate), bio = VALUES(bio)`,
      [consultantId, userId, headline, hourlyRate, experienceYears, bio]
    );

    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        await pool.query(
          `INSERT INTO specializations (id, consultant_id, category, tag_name) VALUES (?, ?, ?, ?)`,
          [`s_${Date.now()}_${Math.random().toString(36).substring(7)}`, consultantId, category || 'career', skill]
        );
      }
    }

    return res.status(201).json({ success: true, message: 'Consultant profile created successfully.' });
  } catch (error) {
    console.error('applyConsultant Error:', error);
    return res.status(500).json({ error: 'Failed to apply as consultant.' });
  }
};