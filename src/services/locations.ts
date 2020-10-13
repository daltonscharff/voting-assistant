import { getDistance } from "geolib";
import qs from "querystring";
import fetch from "node-fetch";
import Location from "../interfaces/Location";
import Coordinates from "../interfaces/Coordinates";
import db from "./db";

async function getLocations(referenceLocation?: string, limit: number = 500, offset: number = 0): Promise<Location[]> {
    let votingLocations: Location[] = await queryVotingLocations();

    if (referenceLocation) {
        const referenceCoordinates = await fetchCoordinates(referenceLocation);
        votingLocations = votingLocations.sort((a, b) => {
            const distA = getDistance(referenceCoordinates, {
                latitude: a.latitude!,
                longitude: a.longitude!
            });
            const distB = getDistance(referenceCoordinates, {
                latitude: b.latitude!,
                longitude: b.longitude!
            });
            return distA - distB;
        });
    }

    return votingLocations.filter((_, i) => i >= offset && i < offset + limit);
}

async function fetchCoordinates(location: string): Promise<Coordinates> {
    if (!location) throw "No location provided";

    const baseUrl: string = "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?"
    const headers: {} = {
        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY!,
        "useQueryString": "true"
    };
    const querystring: string = qs.encode({ q: location });

    try {
        const response = await fetch(baseUrl + querystring, { headers });
        const responseJson: any[] = await response.json();

        if (responseJson.length === 0) throw `Location not found: ${location}`;

        const recommendedLocation = responseJson[0];

        return {
            latitude: recommendedLocation.lat,
            longitude: recommendedLocation.lon
        };
    } catch (e) {
        console.error(e);
        throw "Could not fetch coordinates"
    }
}

async function queryVotingLocations(): Promise<Location[]> {
    try {
        const sql = "SELECT * FROM locations ORDER BY name;";
        return await db.query(sql);
    } catch (e) {
        console.error(e);
        throw "Could not query database for voting locations";
    }
}

export { getLocations, fetchCoordinates };