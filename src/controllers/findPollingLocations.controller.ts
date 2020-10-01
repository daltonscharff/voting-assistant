import { orderByDistance } from "geolib";
import db from "../db/db";
import { getCoordinates } from "../utils/populateLocations";

async function getPollingLocations(zipCode: string, limit: number = 3): Promise<string[]> {
    const zipCoords = await getCoordinates({ zip_code: zipCode });
    const allCoords = await db.getAllCoordinates() || [];
    const orderedCoords = orderByDistance(zipCoords, allCoords);

    const topNCoords: any[] = orderedCoords.filter((_, i) => i < limit);

    const topNLocations = await Promise.all(topNCoords.map(async (coordinate) => await db.getLocationFromCoordinates(coordinate)));
    return topNLocations;
}

export { getPollingLocations };