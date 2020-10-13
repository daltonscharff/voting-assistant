import { Request, Response } from "express";
import * as locationsService from "../services/locations";
import Location from "../interfaces/Location";

async function getHandler(req: Request, res: Response): Promise<void> {
    const referenceLocation: string = (req.query as any).q || "";
    const limit: number = parseInt((req.query as any).n, 10);

    try {
        const locations: Location[] = locationsService.getLocations(referenceLocation, limit);
        res.send(locations);
    } catch (error) {
        res.status(404).send({ error });
    }

    return;
}

export { getHandler };