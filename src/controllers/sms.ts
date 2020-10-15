import { Request, Response } from "express";
import { twiml } from "twilio";
import { nearestLocationResponseBuilder, responses, sendTextMessage } from "../services/sms";
import * as locationsService from "../services/locations";
import Coordinates from "../interfaces/Coordinates";
import Location from "../interfaces/Location";

async function getHandler(req: Request, res: Response): Promise<void> {
    res.sendStatus(200);
}

async function postHandler(req: Request, res: Response): Promise<void> {
    const message: string = req.body.message;
    const language: string = req.body.language;
    const from: string = req.body.From;

    const zipCodePattern: RegExp = /((?:\d{5})(?:-?\d{4})?)/g;
    const zipCodeMatches: string[] | null = message.match(zipCodePattern);

    const sms = new twiml.MessagingResponse();

    if (zipCodeMatches) {
        const zipCode = zipCodeMatches.pop();

        try {
            const zipCodeCoordinates: Coordinates = await locationsService.fetchCoordinates({ postalcode: zipCode, country: "USA" });
            const votingLocations: Location[] = await locationsService.queryVotingLocations(process.env.INCLUDE_EARLY_VOTING_LOCATIONS === "true", process.env.INCLUDE_VOTING_DAY_LOCATIONS === "true");
            const nearestLocations: Location[] = locationsService.findNearestLocations(votingLocations, zipCodeCoordinates, 3, 0);
            let response = nearestLocationResponseBuilder(responses["locationsFound"][language], nearestLocations, language);
            sms.message(response);
            setTimeout(() => sendTextMessage(responses["followUp"][language], from), 5000);
        } catch (e) {
            console.error(e);
            sms.message(responses["noLocationsFound"][language]);
        }
    } else if (message === "vote" || message === "votar" || message === "vota") {
        sms.message(responses["greeting"][language]);
    } else {
        sms.message(responses["fallback"][language]);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(sms.toString());
}

export { getHandler, postHandler };