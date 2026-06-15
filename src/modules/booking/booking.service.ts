import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (!vehicle.rows[0]) throw new Error("Vehicle not found");

  if (vehicle.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const total_price = days * vehicle.rows[0].daily_rent_price;

  //  Booking insert
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) 
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price],
  );

  // Vehicle status "booked"
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id],
  );

  const booking = result.rows[0];
  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.rows[0].vehicle_name,
      daily_rent_price: vehicle.rows[0].daily_rent_price,
    },
  };
};

const getBooking = async (userId: number, role: string) => {
  if (role === "admin") {
    const result = await pool.query(`
      SELECT b.*, 
        u.name as customer_name, u.email as customer_email,
        v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
    `);
    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  } else {
    const result = await pool.query(
      `
      SELECT b.*,
        v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
    `,
      [userId],
    );
    // Customer query return
    return result.rows.map((row) => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type,
      },
    }));
  }
};

const updateBooking = async (
  userId: number,
  role: string,
  bookingId: string,
  status: string,
) => {
  //  Booking
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (!booking.rows[0]) throw new Error("Booking not found");

  const currentBooking = booking.rows[0];

  //  Customer  extra check
  if (role === "customer") {
    if (currentBooking.customer_id !== userId) {
      throw new Error("Forbidden: This is not your booking");
    }

    // Start date check
    const today = new Date();
    const startDate = new Date(currentBooking.rent_start_date);
    if (today >= startDate) {
      throw new Error("Cannot cancel after rental has started");
    }
  }

  //  Booking status update
  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId],
  );

  //  Vehicle status update
  if (status === "cancelled" || status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [currentBooking.vehicle_id],
    );
  }

  return result.rows[0];
};

export const bookingService = {
  createBooking,
  getBooking,
  updateBooking,
};
