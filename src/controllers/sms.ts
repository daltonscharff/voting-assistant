import { Request, Response } from "express";

async function getHandler(req: Request, res: Response): Promise<void> {
    res.sendStatus(200);
}

async function postHandler(req: Request, res: Response): Promise<void> {
    res.sendStatus(200);
}

export { getHandler, postHandler };