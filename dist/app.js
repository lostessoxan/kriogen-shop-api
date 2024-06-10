"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const compression_1 = __importDefault(require("compression"));
const errors_notFound_handlers_1 = require("./middlewares/errors-notFound-handlers");
// =============================== app additional settings
const app = (0, express_1.default)();
const shouldCompress = (req, res) => {
    if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
    }
    // fallback to standard filter function
    return compression_1.default.filter(req, res);
};
app.use((0, compression_1.default)());
app.use((0, compression_1.default)({ filter: shouldCompress }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// =============================== ROUTES
app.get("/", (req, res, next) => {
    res.send("BYE BYE");
});
app.use("/api/products", productRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
// NOT FOUND HANDLER
app.use(errors_notFound_handlers_1.notFoundHandler);
// ERRORS HANDLER
app.use(errors_notFound_handlers_1.errorHandler);
exports.default = app;
