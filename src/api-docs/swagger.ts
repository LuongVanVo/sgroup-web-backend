import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./openAPIDocumentGenerator";

export function setupSwagger(app: Express) {
    const openAPIDocument = generateOpenAPIDocument()

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument, {
        explorer: true,
        swaggerOptions: {
            url: '/api-docs.json'
        }
    }));
}