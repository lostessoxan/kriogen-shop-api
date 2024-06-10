import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { RequestHandler } from "express";

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

const protect: RequestHandler = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (typeof decoded === "string") {
        next(new Error("Invalid token"));
      }

      console.log(decoded.id);
      req.user = await User.findById(decoded.id).select("-password");

      console.log(req.user);
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token"));
  }
};

const admin: RequestHandler = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    next(new Error("Not authorized as an admin"));
  }
};

export { protect, admin };
