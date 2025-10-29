import authenticateToken from "@/middlewares/authenticationCookie";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response } from "express";
const router = express.Router()

export const healthCheckRegistry = new OpenAPIRegistry()

healthCheckRegistry.registerPath({
    method: 'get',
    path: '/healthy-check',
    tags: ['Health Check'],
    summary: 'Health Check Endpoint',
    description: 'Endpoint to check if the server is running and healthy',
    responses: {}
})

router.get('/', authenticateToken, (req: Request, res: Response) => {
// router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Server is healthy',
    })
})

export default router