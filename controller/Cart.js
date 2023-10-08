import { Cart } from "../model/Cart.js";

export const fetchCartByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const cartItems = await Cart.find({ user: user })
      .populate("product")
      .populate("user");

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const addToCart = async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const deleteFromCart = async (req, res) => {
  console.log("In delete cart");
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    // const response = await doc.populate("product");
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateCart = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const response = await cart.populate("product");
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
