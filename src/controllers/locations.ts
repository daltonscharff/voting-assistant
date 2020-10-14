import { Request, Response } from "express";
import * as locationsService from "../services/locations";
import Location from "../interfaces/Location";

async function getHandler(req: Request, res: Response): Promise<void> {
    const referenceLocation: string = (req.query as any).q || "";
    const limit: number | undefined = parseInt((req.query as any).limit, 10) || undefined;
    const offset: number | undefined = parseInt((req.query as any).offset, 10) || undefined;
    const includeEarlyVotingLocations: boolean = ((req.query as any).earlyVotingLocations == "true");
    const includeVotingDayLocations: boolean = ((req.query as any).votingDayLocations == "true");

    try {
        const locations: Location[] = await locationsService.getLocations(referenceLocation, limit, offset, includeEarlyVotingLocations, includeVotingDayLocations);
        res.send(locations);
    } catch (error) {
        res.status(404).send({ error });
    }

    return;
}

export { getHandler };