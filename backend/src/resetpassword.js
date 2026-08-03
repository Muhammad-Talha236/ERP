import { pool } from './config/database.js';
import bcrypt from 'bcryptjs';

async function resetSuperAdminPassword() {
  try {
    console.log("🔄 Resetting Super Admin password...");
    
    // Password hash karein
    const plainPassword = "superadmin123";
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
    
    const result = await pool.query(query, [hashedPassword, 'superadmin@erp.com']);
    
    if (result.rows.length > 0) {
      console.log("✅ Super Admin password updated successfully in DB!");
      console.log("📧 Email:", result.rows[0].email);
    } else {
      console.log("❌ User 'superadmin@erp.com' not found in database.");
    }
  } catch (error) {
    console.error("❌ Error resetting password:", error);
  } finally {
    process.exit(0); // Script khatam karein
  }
}

resetSuperAdminPassword();