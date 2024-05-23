import { Request, Response } from "express";
import Product, { IProduct } from "../models/product";
import { productSchema } from "../validators/productValidator";
import { ZodError } from "zod";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedProduct = productSchema.parse(req.body);
    const newProduct = new Product(validatedProduct);
    await newProduct.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Product created successfully!",
        data: newProduct,
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({
        success: true,
        message: "Products fetched successfully!",
        data: products,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Product fetched successfully!",
        data: product,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedProduct = productSchema.parse(req.body);
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      validatedProduct,
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully!",
        data: product,
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Product deleted successfully!",
        data: null,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm?.toString() || "";
    const products = await Product.find({ name: new RegExp(searchTerm, "i") });
    res
      .status(200)
      .json({
        success: true,
        message: `Products matching search term '${searchTerm}' fetched successfully!`,
        data: products,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
