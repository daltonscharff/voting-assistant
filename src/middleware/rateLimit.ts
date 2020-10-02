import db from "../db/db";
import { Request, Response, NextFunction, text } from "express";
import { twiml } from "twilio";

async function rateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    const fromNumber: string | null = req.body.From;
    let textResponse: string | null = null;

    if (fromNumber) {
        const recordsToday = await db.getRateLimitCount(fromNumber, "-1 day");
        const recordsInPastMinute = await db.getRateLimitCount(fromNumber, "-1 minute");

        if (recordsToday > 50) textResponse = "You've been sending us a lot of texts! Try again tomorrow."
        if (recordsInPastMinute > 20) textResponse = "You've been sending us a lot of texts! Try again in a few minutes.";

        db.setRateLimit(fromNumber);
    } else {
        textResponse = "Sorry. Something has gone wrong with your request. Please wait a few minutes and try again.";
    }


    if (textResponse == null) {
        next();
    } else {
        const sms = new twiml.MessagingResponse();
        sms.message(textResponse);

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(sms.toString());
    }

}

export { rateLimit as default };