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

    dropTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db!.run(`DROP TABLE IF EXISTS ${tableName};`, (err) => {
                if (err) {
                    console.error(`Could not drop table: ${tableName}`);
                    console.error(err);
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