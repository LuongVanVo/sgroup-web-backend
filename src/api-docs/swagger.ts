import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'sgroup-web-backend',
            version: '1.0.0',
            description: 'API documentation for SGroup Web Backend',
        },
        servers: [
            {
                url: 'http://localhost:2309/',
                description: 'Local server',
            }
        ]
    }
}

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: express.Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};