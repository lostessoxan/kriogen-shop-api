"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = express_1.default.Router();
router.route("/").post(userController_1.registerUser).get(auth_middleware_1.protect, auth_middleware_1.admin, userController_1.getAllUsers);
router.route("/login").post(userController_1.authUser);
router
    .route("/profile")
    .get(auth_middleware_1.protect, userController_1.getUserProfile)
    .put(auth_middleware_1.protect, userController_1.updateUserProfile);
router
    .route("/:id")
    .get(auth_middleware_1.protect, userController_1.getUserById)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, userController_1.deleteUser);
router.route("/:id/edit").put(auth_middleware_1.protect, auth_middleware_1.admin, userController_1.updateUser);
exports.default = router;
