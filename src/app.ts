import express from "express";
import bodyParser from "body-parser";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";

const app = express();

app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
