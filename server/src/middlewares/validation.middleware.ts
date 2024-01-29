import { ZodError, ZodAny, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

/**
@description : This is used to validate the zod schema
*/
const validate =
  <T extends ZodAny | ZodObject<any>>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.errors,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

export default validate;
