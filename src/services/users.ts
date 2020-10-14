import db from "./db";
import User from "../interfaces/User";

async function getUser(number: string): Promise<User> {
    await db.run("INSERT OR IGNORE INTO users (number, language) VALUES (?,'en');", [number]);
    return (await db.query("SELECT * FROM users WHERE number = ?;", [number]))[0];
}

async function updateUser(user: User): Promise<void> {
    return db.run("UPDATE users SET language = ?, messageCount = ? WHERE number = ?;", [user.language, user.messageCount, user.number]);
}

export { getUser, updateUser };