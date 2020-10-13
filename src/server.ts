import express from "express";
import dotenv from "dotenv";
import locationsRouter from "./routes/locations";
import smsRouter from "./routes/sms";
import db from "./db/db";

dotenv.config();

const app: express.Application = express();

app.use(express.json());
app.use("/locations", locationsRouter);
app.use("/sms", smsRouter);

app.route("/").get((_, res: express.Response): void => {
    res.sendStatus(200);
});

db.connect();

const port: number = parseInt(process.env.PORT || "8000", 10);
const host: string = process.env.HOST || "localhost";
app.listen(port, host, () => console.log(`Server started on http://${host}:${port}`));