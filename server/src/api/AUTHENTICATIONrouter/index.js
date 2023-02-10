import express from "express";
import createHttpError from "http-errors";
import UsersModel from "../users/model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";

const { NotFound } = createHttpError;

const authRouter = express.Router();

// REGISTER
authRouter.post("/register", async (req, res, next) => {
  try {
    const body = req.body;
    body.isRegistered = true;

    const user = new UsersModel(body); // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error

    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

// LOGIN
authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UsersModel.checkCredentialsUsername(username, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);

      res.status(201).send(accessToken);
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default authRouter;
