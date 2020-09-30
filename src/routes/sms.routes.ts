import express from "express";
import { handlePost, fallback } from "../controllers/sms.controllers";

const router: express.Router = express.Router();

router.route("/")
    .post(handlePost);

router.route("/fallback")
    .get(fallback);

export { router as default };