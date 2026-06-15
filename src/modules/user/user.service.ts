import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`,
  );

  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 
     WHERE id=$5 RETURNING id, name, email, phone, role`,
    [name, email, phone, role, id],
  );

  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id],
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("User has active bookings, cannot delete");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id],
  );

  return result;
};

export const userService = {
  getUser,
  updateUser,
  deleteUser,
};
