import express from "express";
import {
  authUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController";
import { admin, protect } from "../middlewares/auth-middleware";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getAllUsers);
router.route("/login").post(authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .get(protect, getUserById)
  .delete(protect, admin, deleteUser);
router.route("/:id/edit").put(protect, admin, updateUser);

export default router;
