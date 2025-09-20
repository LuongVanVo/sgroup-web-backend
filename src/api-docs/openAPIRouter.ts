import { Request, Response, Router } from "express";
import { generateOpenAPIDocument } from "@/api-docs/openAPIDocumentGenerator";

export const openAPIRouter: Router = (() => {
    const router = Router()
    const openAPIDocument = generateOpenAPIDocument()

    router.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(openAPIDocument)
    })
    return router
})()