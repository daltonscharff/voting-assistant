import db from "../db/db";
import sqlite3 from "sqlite3";

function createRateLimitTable(db: sqlite3.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS rate_limit(
            id INTEGER PRIMARY KEY,
            number TEXT NOT NULL,
            received_at DEFAULT CURRENT_TIMESTAMP
            );`, (err) => {
            if (err) {
                console.error("Could not create table: rate_limit");
                reject();
            } else {
                console.log("Created table: rate_limit");
                resolve();
            }
        });
    });
}

if (require.main === module) {
    (async () => {
        db.connect();
        await db.dropTable("rate_limit");
        await createRateLimitTable(db.db!);
    })();
}