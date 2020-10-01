import express, { Request, Response } from "express";
import { getPollingLocations } from "../controllers/findPollingLocations.controller";

const router: express.Router = express.Router();

router.route("/")
    .get(async (req: Request, res: Response) => {
        const zipCode: any = req.query.zipCode;
        if (!zipCode) res.sendStatus(422);

        let limit: any = req.query.n || req.query.limit || 3;
        if (limit > 5 || limit < 1) limit = 3;

        const locations: string[] = await getPollingLocations(zipCode, limit);

        res.send(locations);
    });

router.route("/:zipCode")
    .get(async (req: Request, res: Response) => {
        const zipCode: any = req.params.zipCode;
        if (!zipCode) res.sendStatus(422);

        let limit: any = req.query.n || req.query.limit || 3;
        if (limit > 5 || limit < 1) limit = 3;

        const locations: string[] = await getPollingLocations(zipCode, limit);

        res.send(locations);
    });

export { router as default };