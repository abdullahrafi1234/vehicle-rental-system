import express from "express";
import auth from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.post("/vehicles", auth("admin"), vehicleController.createVehicle);

router.get("/vehicles", vehicleController.getVehicles);

router.get("/vehicles/:vehicleId", vehicleController.getSingleVehicle);

router.put(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleController.updateVehicle,
);

router.delete(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleController.deleteVehicle,
);

export const vehicleRoutes = router;
