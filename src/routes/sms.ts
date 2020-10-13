import express, { Request, Response } from "express";
import { twiml } from "twilio";
import { generateResponse } from "../controllers/sms";
import rateLimit from "../middleware/rateLimit";

const router: express.Router = express.Router();

router.route("/")
    .post(express.urlencoded({ extended: false }),
        rateLimit,
        async (req: Request, res: Response) => {
            const textResponse = await generateResponse(req.body.Body, req.body.From);

            const sms = new twiml.MessagingResponse();
            sms.message(textResponse);

            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end(sms.toString());
        });

router.route("/fallback")
    .get(() => (req: Request, res: Response) => {
        const sms = new twiml.MessagingResponse();
        sms.message("Something went wrong. Please try again.");
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(sms.toString());
    });

export { router as default };