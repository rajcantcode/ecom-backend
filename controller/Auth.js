import { sanitizeUser } from "../services/common.js";
import { User } from "../model/User.js";
import crypto from "crypto";
const SECRET_KEY =
  "06b7aa767ccfa1e7ed510bf732837237865f0d08dbc0725212b80ac184cd7df836a5f48c256c422e43abdaa6763dab1ffd6a0dad55fc9731cd441bf11466b174";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPass) => {
        const user = new User({
          ...req.body,
          password: hashedPass,
          salt: salt,
        });
        const doc = await user.save();
        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

export const loginUser = async (req, res) => {
  res.json(req.user);
};

export const checkUser = async (req, res) => {
  res.json(req.user);
};
