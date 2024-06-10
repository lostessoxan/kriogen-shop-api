import createHttpError, { isHttpError } from "http-errors";
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
) => {
  console.error(error);

  let statusCode = 500;
  let errorMessage = "An unknown error occurred";
  let errorDetails = {};

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    errorDetails = {
      message: error.message,
      stack: error.stack,
      ...errorDetails,
    };
  }

  res.status(statusCode).json({
    error: errorMessage,
    ...(Object.keys(errorDetails).length > 0 && { details: errorDetails }),
  });
};
