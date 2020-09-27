import sqlite3 from "sqlite3";
import parse from "csv-parse/lib/sync";
import fs from "fs/promises";
import path from "path";

let db: sqlite3.Database;
connect();
populateLocations();

function connect(): sqlite3.Database {
    db = new sqlite3.Database(":memory:", (err) => {
        if (err) {
            console.error("Could not create in-memory database");
            process.exit(1);
        } else {
            console.log("Connected to database");
        }
    });
    return db;
}

function populateLocations(): void {
    const locations = (async () => {
        const filePath = path.join(__dirname, "..", "..", "data", "votingLocations.csv");
        const fileContents = await fs.readFile(filePath);
        return parse(fileContents, {
            columns: true,
            escape: "\\",
            trim: true
        });
    })();

    db.serialize(async () => {
        db.run(`CREATE TABLE locations(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            room TEXT,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            wait_time_mins INTEGER
            );`, async (err) => {
            if (err) {
                console.error("locations table not created", err)
            } else {
                console.log("locations table created");
            }
        }).run("INSERT INTO locations (name, room, address, city, zip_code) VALUES (?, ?, ?, ?, ?);", [
            (await locations)[0].name,
            (await locations)[0].room,
            (await locations)[0].address,
            (await locations)[0].city,
            (await locations)[0].zip_code
        ]).get("SELECT * FROM locations;", (stmt: any, err: any, row: sqlite3.RunResult) => console.log(row));

        // (await locations).map((location: any) => db.run("INSERT INTO locations (name, room, address, city, zip_code) VALUES (?, ?, ?, ?, ?);", [location.name, location.room, location.address, location.city, location.zip_code]));
    })
}

function disconnect(): void {
    db.close((err) => {
        if (err) {
            console.error("Could not close database connection");
        } else {
            console.log("Database connection is now closed");
        }
    })
}


export { connect, disconnect };