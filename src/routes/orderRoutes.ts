import express from "express";
import {
  createOrder,
  getOrderDetails,
  listAllOrders,
  listOrders,
  updateOrderToDeliver,
} from "../controllers/orderController";
import { admin, protect } from "../middlewares/auth-middleware";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, listOrders);
router.route("/all").get(protect, admin, listAllOrders);
router.route("/:id").get(protect, getOrderDetails);
router.route("/:id/deliver").put(protect, admin, updateOrderToDeliver);

export default router;
