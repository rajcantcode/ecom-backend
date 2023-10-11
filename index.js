import express from "express";
import crypto from "crypto";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "./model/User.js";
import { isAuth, sanitizeUser } from "./services/common.js";

const SECRET_KEY =
  "06b7aa767ccfa1e7ed510bf732837237865f0d08dbc0725212b80ac184cd7df836a5f48c256c422e43abdaa6763dab1ffd6a0dad55fc9731cd441bf11466b174";
// JWT options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;

import productsRouter from "./routes/Products.js";
import categoriesRouter from "./routes/Categories.js";
import brandsRouter from "./routes/Brands.js";
import usersRouter from "./routes/Users.js";
import authRouter from "./routes/Auth.js";
import cartRouter from "./routes/Cart.js";
import ordersRouter from "./routes/Orders.js";
const server = express();

console.log("Heyyyyyy");
// middleware
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(express.json());
server.use("/products", isAuth(), productsRouter);
server.use("/categories", isAuth(), categoriesRouter);
server.use("/brands", isAuth(), brandsRouter);
server.use("/users", isAuth(), usersRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/orders", isAuth(), ordersRouter);
passport.use(
  "local",
  new LocalStrategy(async function (username, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: username });
      console.log(username, password, user);
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          // const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, sanitizeUser(user)); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

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
