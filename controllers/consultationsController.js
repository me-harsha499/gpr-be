const pool = require('../db');

// Customer creates a new consultation
createConsultation = async (req, res) => {
  const {
    name, phone, email, city, address,
    property_type, room_type, budget,
    time_slot, consultation_date, message,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO consultations
      (name, phone, email, city, address, property_type, room_type, budget, time_slot, consultation_date, message)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [name, phone, email, city, address, property_type, room_type, budget, time_slot, consultation_date, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin gets all consultations
getAllConsultations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consultations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin gets one consultation
getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM consultations WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin updates call details, message, visited/customer/project status
updateConsultation = async (req, res) => {
  const {
    last_call, next_call, call_status_messages, new_call_message,
    customer_visited, visited_date, project_status
  } = req.body;
  const { id } = req.params;
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (last_call !== undefined) { 
      fields.push(`last_call = $${idx++}`); 
      values.push(last_call); 
    }
    if (next_call !== undefined) { 
      fields.push(`next_call = $${idx++}`); 
      values.push(next_call); 
    }
    
    // Handle call status messages (JSONB array)
    if (call_status_messages !== undefined) { 
      fields.push(`call_status_messages = $${idx++}`); 
      values.push(JSON.stringify(call_status_messages)); 
    }
    
    // Handle adding a new call message to the existing array
    if (new_call_message !== undefined) {
      const newMessage = {
        timestamp: new Date().toISOString(),
        message: new_call_message
      };
      fields.push(`call_status_messages = call_status_messages || $${idx++}::jsonb`);
      values.push(JSON.stringify([newMessage]));
    }
    
    if (typeof customer_visited === 'boolean') { 
      fields.push(`customer_visited = $${idx++}`); 
      values.push(customer_visited); 
    }
    if (visited_date !== undefined) { 
      fields.push(`visited_date = $${idx++}`); 
      values.push(visited_date); 
    }
    if (project_status !== undefined) { 
      fields.push(`project_status = $${idx++}`); 
      values.push(project_status); 
    }

    if (!fields.length) return res.status(400).json({ message: 'No updatable fields sent' });

    values.push(id);

    const query = `UPDATE consultations SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin adds a new call message to existing consultation
addCallMessage = async (req, res) => {
  const { message } = req.body;
  const { id } = req.params;
  
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }
  
  try {
    const newMessage = {
      timestamp: new Date().toISOString(),
      message: message
    };
    
    const query = `
      UPDATE consultations 
      SET call_status_messages = call_status_messages || $1::jsonb,
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *`;
    
    const result = await pool.query(query, [JSON.stringify([newMessage]), id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin gets call messages for a consultation
getCallMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT call_status_messages FROM consultations WHERE id = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json({ 
      consultation_id: id,
      call_messages: result.rows[0].call_status_messages || []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createConsultation,
    updateConsultation,
    getAllConsultations,
    getConsultationById,
    addCallMessage,
    getCallMessages
}