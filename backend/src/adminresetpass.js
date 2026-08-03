import { pool } from './config/database.js';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  try {
    console.log("🔄 Resetting  Admin password...");
    
    // Password hash karein
    const plainPassword = "kohinoor";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log("✅ Generated Hash:", hashedPassword);

    // Update query run karein
    const query = `
      UPDATE users 
      SET password = $1 
      WHERE email = $2
      RETURNING id, email, password
    `;
    
    const result = await pool.query(query, [hashedPassword, 'kohinoor@gmail.com']);
    
    if (result.rows.length > 0) {
      console.log("✅  Admin password updated successfully in DB!");
      console.log("📧 Email:", result.rows[0].email);
    } else {
      console.log("❌ User 'kohinoor@gmail.com' not found in database.");
    }
  } catch (error) {
    console.error("❌ Error resetting password:", error);
  } finally {
    process.exit(0); // Script khatam karein
  }
}

resetAdminPassword();