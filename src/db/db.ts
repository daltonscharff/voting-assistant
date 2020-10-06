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
            this.db = new sqlite3.Database(this.location, (err) => {
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
            this.db!.get(`SELECT COUNT(*) AS count FROM rate_limit WHERE number = '${from}' AND received_at >= DATETIME('now', '${period}');`, (err, row) => {
                if (err) {
                    console.error(`Could not SELECT on rate_limit`);
                    reject();
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    setRateLimit(from: string, message: string = ""): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.run(`INSERT INTO rate_limit (number, message) VALUES (?, ?);`, [from, message], (err) => {
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

    setLanguage(number: string, language: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.run(`UPDATE rate_limit
                SET language = ?
                WHERE id = (SELECT id FROM rate_limit WHERE number = ? ORDER BY received_at DESC)
                ;`, [language, number], (err) => {
                if (err) {
                    console.error(`Could not UPDATE on rate_limit`);
                    console.error(err);
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    getLanguage(number: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.db!.get(`SELECT language FROM rate_limit WHERE number = ? AND language NOT NULL ORDER BY received_at DESC;`, [number], (err, row) => {
                if (err) {
                    console.error(`Could not SELECT on rate_limit`);
                    reject();
                } else {
                    if (row) {
                        resolve(row.language);
                    } else {
                        console.log(row);
                        resolve();
                    }
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

const db = new Database("./data/voting.db");

export { db as default };