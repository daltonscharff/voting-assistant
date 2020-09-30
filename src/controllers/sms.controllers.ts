import { Request, Response } from "express";
import { twiml } from "twilio";

function handlePost(req: Request, res: Response) {
    console.log("request params:", req.params);
    console.log("request body:", req.body);

    const sms = new twiml.MessagingResponse();
    sms.message("Message received");

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(sms.toString());
}

function fallback(req: Request, res: Response) {
    const sms = new twiml.MessagingResponse();
    sms.message("Something went wrong. Please try again.");
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(sms.toString());
}

export { handlePost, fallback };