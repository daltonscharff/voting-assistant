import db from "../db/db";
import parse from "csv-parse/lib/sync";
import { promises as fsPromises } from "fs";
import sqlite3 from "sqlite3";
import qs from "querystring";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

function createLocationsTable(db: sqlite3.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS locations(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            room TEXT,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            wait_time_mins INTEGER
            );`, (err) => {
            if (err) {
                console.error("Could not create table: locations");
                reject();
            } else {
                console.log("Created table: locations");
                resolve();
            }
        });
    });
}

async function loadLocationsFromFile(filePath: string): Promise<any[]> {
    return await (async () => {
        const fileContents = await fsPromises.readFile(filePath);
        return parse(fileContents, {
            columns: true,
            escape: "\\",
            trim: true
        });
    })();
}

async function loadLocationIntoTable(db: sqlite3.Database, location: any): Promise<void[]> {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO locations (name, room, address, city, zip_code, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?);", [
            location.name,
            location.room,
            location.address,
            location.city,
            location.zip_code,
            location.latitude,
            location.longitude
        ], (err) => {
            if (err) {
                console.error(`Could not insert location ${location.name} into locations table`);
                reject();
            } else {
                resolve();
            }
        });
    });
}

async function getCoordinates(location: {
    name?: string,
    address?: string,
    city?: string,
    zip_code: string
}): Promise<{ latitude: string, longitude: string } | void> {
    if (location.name && location.name!.toLowerCase() === "wilmer community center") return { latitude: "32.589828", longitude: "-96.684952" }


    const baseUrl = "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?"
    const headers = {
        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY!,
        "useQueryString": "true"
    };

    const params: any = {
        country: "United States",
        postalcode: location.zip_code,
        format: "json"
    };
    if (location.address) params["street"] = location.address;
    if (location.city) params["city"] = location.city;

    const querystring = qs.encode(params);

    const res = await (await fetch(baseUrl + querystring, {
        headers
    })).json();

    if (res[0]) {
        return {
            latitude: res[0].lat,
            longitude: res[0].lon
        }
    } else {
        return;
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const csvLocation = "./data/votingLocations.csv";

if (require.main === module) {
    (async () => {
        await db.connect();
        await db.dropTable("locations");
        await createLocationsTable(db.db!);
        const locations = await loadLocationsFromFile(csvLocation);
        console.log("Retrieving location data...");
        for (let location of locations) {
            try {
                const { latitude, longitude } = await getCoordinates(location) || {};
                await sleep(334);
                loadLocationIntoTable(db.db!, {
                    ...location,
                    latitude,
                    longitude
                });
            } catch (e) {
                console.error("Error finding latitude and longitude:", location.name);
                loadLocationIntoTable(db.db!, location);
            }
        }
        await db.disconnect();
    })();
}


export { getCoordinates };
