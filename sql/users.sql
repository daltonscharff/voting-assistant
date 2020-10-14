-- create table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL,
    textsReceived INTEGER DEFAULT 0
);
