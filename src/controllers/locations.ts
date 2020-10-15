import { Request, Response } from "express";
import * as locationsService from "../services/locations";
import Location from "../interfaces/Location";
import Coordinates from "../interfaces/Coordinates";
import GeocodingSearchParameters from "../interfaces/GeocodingSearchParameters";

async function getHandler(req: Request, res: Response): Promise<void> {
    const referenceLocation: GeocodingSearchParameters = {};
    if ((req.query as any).street) referenceLocation["street"] = (req.query as any).street;
    if ((req.query as any).zipCode) referenceLocation["postalcode"] = (req.query as any).zipCode;
    if ((req.query as any).county) referenceLocation["county"] = (req.query as any).county;
    if ((req.query as any).state) referenceLocation["state"] = (req.query as any).state;
    if ((req.query as any).country) referenceLocation["country"] = (req.query as any).country;

    const limit: number | undefined = parseInt((req.query as any).limit, 10) || undefined;
    const offset: number | undefined = parseInt((req.query as any).offset, 10) || undefined;
    const includeEarlyVotingLocations: boolean = ((req.query as any).earlyVotingLocations == "true");
    const includeVotingDayLocations: boolean = ((req.query as any).votingDayLocations == "true");

    try {
        const referenceCoordinates: Coordinates = await locationsService.fetchCoordinates(referenceLocation);
        const votingLocations: Location[] = await locationsService.queryVotingLocations(includeEarlyVotingLocations, includeVotingDayLocations);
        const nearestLocations: Location[] = locationsService.findNearestLocations(votingLocations, referenceCoordinates, limit, offset);
        res.send(nearestLocations);
    } catch (error) {
        res.status(404).send({ error });
    }
}

export { getHandler };