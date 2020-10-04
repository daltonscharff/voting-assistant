import express from "express";
import dotenv from "dotenv";
import findPollingLocationRouter from "./routes/findPollingLocations.router";
import smsRouter from "./routes/sms.routes";
import db from "./db/db";

dotenv.config();

const app: express.Application = express();

app.use(express.json());
app.use("/findPollingLocations", findPollingLocationRouter);
app.use("/sms", smsRouter);

app.route("/").get((req: express.Request, res: express.Response): void => {
    console.log("status: OK")
    res.send({ status: "Ok" });
});

db.connect();

const port: number = parseInt(process.env.PORT || "8000", 10);
const hostname: string = process.env.HOST || "localhost";
app.listen(port, hostname, () => console.log(`Server started on http://${hostname}:${port}`));