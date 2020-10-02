import express, { Request, Response } from "express";
import { getPollingLocations } from "../controllers/findPollingLocations.controller";

const router: express.Router = express.Router();

router.route("/")
    .get(async (req: Request, res: Response) => {
        const zipCode: any = req.query.zipCode;
        if (!zipCode) res.sendStatus(422);

        let limit: any = req.query.n || req.query.limit || 3;
        if (limit > 5 || limit < 1) limit = 3;

        const locations: string[] | null = await getPollingLocations(zipCode, limit);

        if (locations) {
            res.send(locations);
        } else {
            res.sendStatus(422);
        }
    });

router.route("/:zipCode")
    .get(async (req: Request, res: Response) => {
        const zipCode: any = req.params.zipCode;
        if (!zipCode) res.sendStatus(422);

        let limit: any = req.query.n || req.query.limit || 3;
        if (limit > 5 || limit < 1) limit = 3;

        const locations: string[] | null = await getPollingLocations(zipCode, limit);

        if (locations) {
            res.send(locations);
        } else {
            res.sendStatus(422);
        }
    });

export { router as default };