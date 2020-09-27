import { Request, Response } from "express";

async function handleGet(req: Request, res: Response): Promise<void> {
    const zipCode = req.query.zipCode || req.params.zipCode;
    const limit = req.query.n || req.query.limit || 3;

    if (!zipCode) res.sendStatus(422);

    res.send({ zipCode, limit });
}



export { handleGet };