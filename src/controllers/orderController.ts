import { Request, Response } from "express";
import Order, { IOrder } from "../models/order";
import Product from "../models/product";
import { orderSchema } from "../validators/orderValidator";
import { ZodError } from "zod";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validatedOrder = orderSchema.parse(req.body);

    const product = await Product.findById(validatedOrder.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.inventory.quantity < validatedOrder.quantity) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Insufficient quantity available in inventory",
        });
    }

    product.inventory.quantity -= validatedOrder.quantity;
    product.inventory.inStock = product.inventory.quantity > 0;
    await product.save();

    const newOrder = new Order(validatedOrder);
    await newOrder.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Order created successfully!",
        data: newOrder,
      });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation Error",
          errors: error.errors,
        });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res
      .status(200)
      .json({
        success: true,
        message: "Orders fetched successfully!",
        data: orders,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOrdersByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email?.toString();
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email query parameter is required" });
    }
    const orders = await Order.find({ email });
    res
      .status(200)
      .json({
        success: true,
        message: "Orders fetched successfully for user email!",
        data: orders,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
