import { getDistance } from "geolib";
import qs from "querystring";
import fetch from "node-fetch";
import Location from "../interfaces/Location";
import Coordinates from "../interfaces/Coordinates";
import GeocodingSearchParameters from "../interfaces/GeocodingSearchParameters";
import db from "./db";

async function getLocations(votingLocations: Location[], reference: Coordinates, limit: number = 500, offset: number = 0): Promise<Location[]> {
    if (reference) {
        votingLocations = votingLocations.sort((a, b) => {
            const distA = getDistance(reference, {
                latitude: a.latitude!,
                longitude: a.longitude!
            });
            const distB = getDistance(reference, {
                latitude: b.latitude!,
                longitude: b.longitude!
            });
            return distA - distB;
        });
    }

    return votingLocations.filter((_, i) => i >= offset && i < offset + limit);
}

async function fetchCoordinates(location: GeocodingSearchParameters): Promise<Coordinates> {
    if (!location) throw "No location provided";

    const baseUrl: string = "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?"
    const headers: {} = {
        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY!,
        "useQueryString": "true"
    };
    const querystring: string = qs.encode({ ...location, format: "json" });

    try {
        const response = await fetch(baseUrl + querystring, { headers });
        const responseJson: any[] = await response.json();

        if (!responseJson) throw `Location not found: ${location}`;

        const recommendedLocation = responseJson[0];

        return {
            latitude: recommendedLocation.lat,
            longitude: recommendedLocation.lon
        };
    } catch (e) {
        throw "Could not fetch coordinates"
    }
}

async function queryVotingLocations(includeEarlyVotingLocations: boolean, includeVotingDayLocations: boolean): Promise<Location[]> {
    try {
        const sql = `SELECT * FROM locations WHERE isEarlyVotingLocation = ${includeEarlyVotingLocations ? 1 : 0} AND isVotingDayLocation = ${includeVotingDayLocations ? 1 : 0} ORDER BY name;`;
        return await db.query(sql);
    } catch (e) {
        console.error(e);
        throw "Could not query database for voting locations";
    }
}

export { getLocations, fetchCoordinates, queryVotingLocations };