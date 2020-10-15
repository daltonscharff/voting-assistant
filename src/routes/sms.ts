import express from "express";
import * as smsController from "../controllers/sms";
import processMessage from "../middleware/processMessage";

const router: express.Router = express.Router();

router.route("/")
    .get(smsController.getHandler)
    .post(express.urlencoded({ extended: false }), processMessage, smsController.postHandler);

export { router as default };