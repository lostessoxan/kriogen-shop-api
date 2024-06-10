import Order from "../models/orderModel";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";

interface CreateOrderBody {
  orderItems: any[];
  shippingAddress: string;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const createOrder: RequestHandler<unknown, unknown, CreateOrderBody> = async (
  req,
  res,
  next,
) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(createHttpError(400, `No order items`));
  }

  const order = await Order.create({
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
  } else {
    next(createHttpError(400, `Invalid order data`));
  }
};

const listOrders: RequestHandler = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.json(orders);
  } else {
    next(createHttpError(404, `No orders found`));
  }
};

const getOrderDetails: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(createHttpError(400, "Id is not valid"));
  }

  const order = await Order.findById(req.params.id).populate(
    "user",
    "_id name email isAdmin",
  );

  if (order) {
    res.json(order);
  } else {
    next(createHttpError(404, "Order not found"));
  }
};

const updateOrderToDeliver: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(createHttpError(400, "Id is not valid"));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(createHttpError(404, "Order not found"));
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();

  res.json(updatedOrder);
};

const listAllOrders: RequestHandler = async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "_id name");

  if (!orders) {
    return next(createHttpError(404, "Orders not found"));
  }

  res.json(orders);
};

export {
  createOrder,
  listOrders,
  getOrderDetails,
  updateOrderToDeliver,
  listAllOrders,
};
