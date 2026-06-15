import express from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/users", auth("admin"), userController.getUser);

router.put(
  "/users/:userId",
  auth("admin", "customer"),
  userController.updateUser,
);

router.delete("/users/:userId", auth("admin"), userController.deleteUser);

export const userRoutes = router;
