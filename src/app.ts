import express, { Request, Response } from "express";
import initDB from "./config/db";
import autoReturnJob from "./jobs/autoReturn";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

const app = express();
app.use(express.json());

// initializing DB
initDB();
autoReturnJob();

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System is running");
});

// auth CRUD
app.use("/api/v1/auth", authRoutes);

// vehicles CRUD
app.use("/api/v1", vehicleRoutes);

// // USERS CRUD
app.use("/api/v1", userRoutes);

// // BOOKING CRUD
app.use("/api/v1", bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
