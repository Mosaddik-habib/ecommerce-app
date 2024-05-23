import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrdersByEmail,
} from "../controllers/orderController";

const router = Router();
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/email", getOrdersByEmail);

export default router;
