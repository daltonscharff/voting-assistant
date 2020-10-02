import sqlite3 from "sqlite3";

class Database {
    db: sqlite3.Database | null;
    location: string;

    constructor(location: string) {
        this.db = null;
        this.location = location;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database("./src/db/voting.db", (err) => {
                if (err) {
                    console.error("Could not connect to database");
                    reject();
                } else {
                    console.log("Connected to database");
                    resolve();
                }
            });
        })
    };

    disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!db) reject();
            this.db!.close((err) => {
                if (err) {
                    console.error("Could not close database connection");
                    reject();
                } else {
                    console.log("Database connection is now closed");
                    resolve();
                }
            });
        });
    }

    getRateLimitCount(from: string, period: string = "-1 day"): Promise<any | void> {
        return new Promise((resolve, reject) => {
            this.db!.get(`SELECT COUNT(*) AS count FROM rate_limit WHERE number = ${from} AND received_at >= DATE('now', '${period}');`, (err, row) => {
                if (err) {
                    console.error(`Could not SELECT on rate_limit`);
                    reject();
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    setRateLimit(from: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.run(`INSERT INTO rate_limit (number) VALUES (?);`, [from], (err) => {
                if (err) {
                    console.error(`Could not INSERT INTO rate_limit`);
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    getAllCoordinates(): Promise<any[] | void> {
        return new Promise((resolve, reject) => {
            this.db!.all(`SELECT latitude, longitude FROM locations;`, (err, rows) => {
                if (err) {
                    console.error(`Could not SELECT on locations`);
                    reject();
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getLocationFromCoordinates(coordinates: { latitude: number, longitude: number }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db!.get(`SELECT * FROM locations WHERE latitude = ? AND longitude = ?;`, [coordinates.latitude, coordinates.longitude], (err, row) => {
                if (err) {
                    console.error(`Could not SELECT on locations`);
                    reject();
                } else {
                    resolve(row);
                }
            });
        });
    }



    dropTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.run(`DROP TABLE IF EXISTS ${tableName};`, (err) => {
                if (err) {
                    console.error(`Could not drop table: ${tableName}`);
                    reject();
                } else {
                    console.log(`Dropped table: ${tableName}`)
                    resolve();
                }
            })
        })
    }
}

const db = new Database("./db/voting.db");

export { db as default };