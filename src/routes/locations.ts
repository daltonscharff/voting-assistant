import express from "express";
import * as locationsController from "../controllers/locations";

const router: express.Router = express.Router();

router.route("/")
    .get(locationsController.getHandler);

export { router as default };