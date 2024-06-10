"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_middleware_1 = require("../middlewares/auth-middleware");
// import { admin, protect } from "../middlewares/authMiddleware.mjs";
const router = express_1.default.Router();
router.route("/").get(productController_1.getProducts).post(auth_middleware_1.protect, auth_middleware_1.admin, productController_1.createProduct);
router.route("/sortBy/:sortName").get(productController_1.getSortedProducts);
router.route("/top").get(productController_1.getTopProducts);
router.route("/:id/reviews").post(auth_middleware_1.protect, productController_1.createProductReview);
router
    .route("/:id")
    .get(productController_1.getProduct)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, productController_1.deleteProduct)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, productController_1.updateProduct);
// ==========================
// router.route("/").get(getProducts).post(createProduct);
// router.route("/sortBy/:sortName").get(getSortedProducts);
// router.route("/top").get(getTopProducts);
// router.route("/:id/reviews").post(createProductReview);
// router.route("/:id").get(getProduct).delete(deleteProduct).put(updateProduct);
exports.default = router;
