import express from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/bookings",
  auth("admin", "customer"),
  bookingController.createBooking,
);

router.get(
  "/bookings",
  auth("admin", "customer"),
  bookingController.getBooking,
);

router.put(
  "/bookings/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking,
);

export const bookingRoutes = router;
