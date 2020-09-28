import { Request, Response } from "express";
import { getDistance, orderByDistance } from "geolib";
import db from "../db/db";
import { getCoordinates } from "../../utils/populateLocations";

async function handleGet(req: Request, res: Response): Promise<void> {
    const zipCode = req.query.zipCode?.toString() || req.params.zipCode.toString();
    let limit = req.query.n || req.query.limit || 3;

    if (limit > 5 || limit < 1) limit = 3;
    if (!zipCode) res.sendStatus(422);


    // get zipcode coordinates
    // get list of voting place coordinates from db
    // orderByDistance and return result

    const zipCoords = await getCoordinates({ zip_code: zipCode });
    const allCoords = await db.getAllCoordinates() || [];
    const orderedCoords = orderByDistance(zipCoords, allCoords);

    const topNCoords: any[] = orderedCoords.filter((_, i) => i < limit);

    const topNLocations = await Promise.all(topNCoords.map(async (coordinate) => await db.getLocationFromCoordinates(coordinate)));

    res.send({ zipCode, topNLocations, limit });
}



export { handleGet };