import { User } from "../model/User.js";

export const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
      orders: user.orders,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
