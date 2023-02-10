import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "../USER/model.js";
import AccommodationsModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostOnly.js";
import { hallPassMiddleware } from "../../lib/auth/hallPassAuth.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";
import mongoose from "mongoose";

// Bad Request (400)
// Unauthorized (401)
// Forbidden (403)
// Not Found (404)
const { BadRequest, Unauthorized, Forbidden, NotFound } = createHttpError;

const accommodationRouter = express.Router();

// POST - accommodation
accommodationRouter.route("/").post(JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  try {
    const { name, description, maxGuests, city } = req.body;

    if (!name || !description || !maxGuests || !city) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    // if (!mongoose.Types.ObjectId.isValid(host)) {
    //   return res.status(400).send({ error: "Invalid host id" });
    // }

    // const travelUser = await TravelUsersModel.findById(host);
    // if (!travelUser) {
    //   return res.status(400).send({ error: "Host not found" });
    // }

    const accommodation = new AccommodationsModel({
      name,
      host: req.user._id,
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

// GET - all accommodations [HOSTS & GUESTS]
accommodationRouter.route("/").get(JWTAuthMiddleware, hallPassMiddleware, async (req, res, next) => {
  try {
    const accommodations = await AccommodationsModel.find().populate("host");

    if (accommodations.length > 0) {
      res.send({ accommodations });
    } else {
      next(NotFound(`You have not made any accommodations yet`));
    }
  } catch (error) {
    console.log("GET /me/accommodations - ERROR: ", error);
    next(error);
  }
});

export default accommodationRouter;
