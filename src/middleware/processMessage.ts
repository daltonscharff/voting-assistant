import { Request, Response, NextFunction } from "express";
import * as userServices from "../services/users";

async function processMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const message: string = req.body.Body.toLowerCase().trim().replace(/\.|\?|\!|\'|\"/g, '');
    req.body.message = message;
    const userNumber: string = req.body.From;

    try {
        const user = await userServices.getUser(userNumber);
        user.messageCount++;

        if (message === "vote") {
            user.language = "en";
        } else if (message === "votar" || message === "vota") {
            user.language = "es";
        }

        req.body.language = user.language;
        await userServices.updateUser(user);

        next();
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}

export { processMessage as default };