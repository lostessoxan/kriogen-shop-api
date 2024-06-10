"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllOrders = exports.updateOrderToDeliver = exports.getOrderDetails = exports.listOrders = exports.createOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const createOrder = async (req, res, next) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, } = req.body;
    if (orderItems && orderItems.length === 0) {
        return next((0, http_errors_1.default)(400, `No order items`));
    }
    const order = await orderModel_1.default.create({
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user._id,
    });
    if (order) {
        res.status(201).json(order);
    }
    else {
        next((0, http_errors_1.default)(400, `Invalid order data`));
    }
};
exports.createOrder = createOrder;
const listOrders = async (req, res, next) => {
    const orders = await orderModel_1.default.find({ user: req.user._id });
    if (orders) {
        res.json(orders);
    }
    else {
        next((0, http_errors_1.default)(404, `No orders found`));
    }
};
exports.listOrders = listOrders;
const getOrderDetails = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return next((0, http_errors_1.default)(400, "Id is not valid"));
    }
    const order = await orderModel_1.default.findById(req.params.id).populate("user", "_id name email isAdmin");
    if (order) {
        res.json(order);
    }
    else {
        next((0, http_errors_1.default)(404, "Order not found"));
    }
};
exports.getOrderDetails = getOrderDetails;
const updateOrderToDeliver = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return next((0, http_errors_1.default)(400, "Id is not valid"));
    }
    const order = await orderModel_1.default.findById(req.params.id);
    if (!order) {
        return next((0, http_errors_1.default)(404, "Order not found"));
    }
    order.isDelivered = true;
    order.deliveredAt = new Date();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
};
exports.updateOrderToDeliver = updateOrderToDeliver;
const listAllOrders = async (req, res, next) => {
    const orders = await orderModel_1.default.find({}).populate("user", "_id name");
    if (!orders) {
        return next((0, http_errors_1.default)(404, "Orders not found"));
    }
    res.json(orders);
};
exports.listAllOrders = listAllOrders;
