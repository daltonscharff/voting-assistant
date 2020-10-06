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

function addLanguageToTable(db: sqlite3.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`ALTER TABLE rate_limit
            ADD COLUMN language TEXT
            ;`, (err) => {
            if (err) {
                console.error("Could not add column: language");
                console.log(err);
                resolve();
            } else {
                console.log("Added column: language");
                resolve();
            }
        });
    });
}

function addMessageToTable(db: sqlite3.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`ALTER TABLE rate_limit
            ADD COLUMN message TEXT
            ;`, (err) => {
            if (err) {
                console.error("Could not add column: message");
                console.log(err);
                resolve();
            } else {
                console.log("Added column: message");
                resolve();
            }
        });
    });
}

if (require.main === module) {
    (async () => {
        await db.connect();
        await createRateLimitTable(db.db!);
        await addLanguageToTable(db.db!);
        await addMessageToTable(db.db!);
        await db.disconnect();
    })();
}