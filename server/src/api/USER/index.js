import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostOnly.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";

const { NotFound } = createHttpError;

const usersRouter = express.Router();

// GET - your own user profile
usersRouter.route("/me").get(JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { _id } = req.user;

    const myUserProfile = await TravelUsersModel.findById(_id);
    if (myUserProfile) {
      res.send({ myUserProfile });
    } else {
      next(NotFound(`The user with id: ${_id} is not in our database`));
    }
  } catch (error) {
    console.log(`/me - GET user ERROR: ${error}`);
    next(error);
  }
});

export default usersRouter;
