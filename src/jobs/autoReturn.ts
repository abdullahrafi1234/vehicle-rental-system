import cron from "node-cron";
import { pool } from "../config/db";

const autoReturnJob = () => {
  cron.schedule("0 0 * * *", async () => {
    // console.log("Running auto-return job");

    await pool.query(`
      UPDATE vehicles 
      SET availability_status='available'
      WHERE id IN (
        SELECT vehicle_id FROM bookings 
        WHERE status='active' 
        AND rent_end_date < CURRENT_DATE
      )
    `);

    await pool.query(`
      UPDATE bookings 
      SET status='returned'
      WHERE status='active' 
      AND rent_end_date < CURRENT_DATE
    `);
  });
};

export default autoReturnJob;
