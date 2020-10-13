import sqlite3 from "sqlite3";

class Database {
    db: sqlite3.Database | null;
    filepath: string;

    constructor(filepath: string) {
        this.db = null;
        this.filepath = filepath;
    }

    connect(filepath: string = this.filepath): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(filepath, (err) => {
                if (err) {
                    console.error("Could not connect to database");
                    reject();
                } else {
                    console.log("Connected to database");
                    resolve();
                }
            });
        })
    }

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

    query(sql: string, params?: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db!.all(sql, params, (err, rows) => {
                if (err) {
                    console.error(`Error while querying\nsql:${sql}\nparams:${params}`);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    run(sql: string, params?: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db!.run(sql, params, (err) => {
                if (err) {
                    console.error(`Error while running\nsql:${sql}\nparams:${params}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const db = new Database("./data/voting.db");

export { db as default };