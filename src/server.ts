import express from "express";
import dotenv from "dotenv";
import findPollingLocationRouter from "./routes/findPollingLocations.router";
import db from "./db/db";

dotenv.config();

const app: express.Application = express();

app.route("/").get((req: express.Request, res: express.Response): void => {
    res.send({ response: "Ok" });
});

app.use("/findPollingLocations", findPollingLocationRouter);

db.connect();

const port: number = parseInt(process.env.PORT || "8000", 10);
const host: string = process.env.HOST || "localhost";

app.listen(port, () => console.log(`Server started on http://${host}:${port}`));