import db from "../db/db";
import { Request, Response, NextFunction, text } from "express";
import { twiml } from "twilio";

async function rateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    next();
}

export { rateLimit as default };