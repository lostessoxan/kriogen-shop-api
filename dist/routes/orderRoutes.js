"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = express_1.default.Router();
router.route("/").post(auth_middleware_1.protect, orderController_1.createOrder).get(auth_middleware_1.protect, orderController_1.listOrders);
router.route("/all").get(auth_middleware_1.protect, auth_middleware_1.admin, orderController_1.listAllOrders);
router.route("/:id").get(auth_middleware_1.protect, orderController_1.getOrderDetails);
router.route("/:id/deliver").put(auth_middleware_1.protect, auth_middleware_1.admin, orderController_1.updateOrderToDeliver);
exports.default = router;
