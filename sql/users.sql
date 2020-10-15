-- create table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL,
    messageCount INTEGER NOT NULL DEFAULT 0
);
