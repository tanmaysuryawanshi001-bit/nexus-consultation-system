const pool = require('../config/db');

exports.createBooking = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { consultantId, sessionDate, durationMinutes = 60, notes = '' } = req.body;

    if (!consultantId || !sessionDate) {
      return res.status(400).json({ error: 'Consultant and session date/time are required.' });
    }

    // Get consultant hourly rate
    const [consultants] = await pool.query(
      'SELECT hourly_rate FROM consultant_profiles WHERE id = ?',
      [consultantId]
    );

    if (consultants.length === 0) {
      return res.status(404).json({ error: 'Consultant not found.' });
    }

    const hourlyRate = parseFloat(consultants[0].hourly_rate);
    const totalPrice = (hourlyRate * (durationMinutes / 60)).toFixed(2);
    // Railway's live schema uses an integer auto-increment booking ID.
    const bookingValues = [clientId, consultantId, new Date(sessionDate), durationMinutes, totalPrice];
    let bookingId;
    try {
      const [result] = await pool.query(
        `INSERT INTO bookings (client_id, consultant_id, session_date, duration_minutes, status, total_price, notes)
         VALUES (?, ?, ?, ?, 'confirmed', ?, ?)`, [...bookingValues, notes]);
      bookingId = result.insertId;
    } catch (insertError) {
      // Older Railway schemas may not have the optional notes column yet.
      if (insertError.code !== 'ER_BAD_FIELD_ERROR' || !insertError.message.includes("'notes'")) throw insertError;
      const [result] = await pool.query(
        `INSERT INTO bookings (client_id, consultant_id, session_date, duration_minutes, status, total_price)
         VALUES (?, ?, ?, ?, 'confirmed', ?)`, bookingValues);
      bookingId = result.insertId;
    }

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: {
        id: bookingId,
        sessionDate,
        durationMinutes,
        totalPrice,
      }
    });
  } catch (error) {
    console.error('createBooking Error:', error);
    return res.status(500).json({ error: 'Failed to process booking.' });
  }
};
