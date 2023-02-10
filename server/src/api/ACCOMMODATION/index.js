import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "../USER/model.js";
import AccommodationsModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostOnly.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";
import mongoose from "mongoose";

const { NotFound } = createHttpError;

const accommodationRouter = express.Router();

// GET - your own user profile
accommodationRouter.route("/").post(JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  try {
    const { name, description, maxGuests, city, host } = req.body;

    if (!name || !description || !maxGuests || !city || !host) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(host)) {
      return res.status(400).send({ error: "Invalid host id" });
    }

    const travelUser = await TravelUsersModel.findById(host);
    if (!travelUser) {
      return res.status(400).send({ error: "Host not found" });
    }

    const accommodation = new AccommodationsModel({
      name,
      host,
      description,
      maxGuests,
      city,
    });
    const newAccommodation = await accommodation.save();

    res.send({ newAccommodation });
  } catch (error) {
    console.log(`POST accommodation - ERROR: ${error}`);
    next(error);
  }
});

export default accommodationRouter;
