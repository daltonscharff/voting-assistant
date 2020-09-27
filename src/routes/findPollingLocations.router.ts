import express from "express";
import { handleGet } from "../controllers/findPollingLocations.controller";

const router: express.Router = express.Router();

router.route("/")
    .get(handleGet);

router.route("/:zipCode")
    .get(handleGet);

export { router as default };