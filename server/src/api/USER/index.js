import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/hostOnly.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";

const { NotFound } = createHttpError;

const usersRouter = express.Router();
