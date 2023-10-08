import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productsRouter from "./routes/Products.js";
import categoriesRouter from "./routes/Categories.js";
import brandsRouter from "./routes/Brands.js";
import usersRouter from "./routes/Users.js";
import authRouter from "./routes/Auth.js";
import cartRouter from "./routes/Cart.js";
const server = express();

// middleware
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use("/products", productsRouter);
server.use("/categories", categoriesRouter);
server.use("/brands", brandsRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/cart", cartRouter);

main().catch((err) => console.log(err));

async function main() {
  console.log("main called");
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

server.get("/", (req, res) => {
  res.json({ status: "suckcess" });
});
server.listen("8080", () => {
  console.log("Server started");
});
