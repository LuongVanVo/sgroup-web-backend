import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { Express } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { 
            title: 'SGroup Web Backend API', 
            version: '1.0.0',
            description: 'API documentation for SGroup Web Backend'
        },
        servers: [
            {
                url: 'http://localhost:2309',
                description: 'Local server'
            }
        ]
    },
    apis: [
        path.join(__dirname, '..', 'docs', '*.ts'),
        path.join(__dirname, '..', 'routes', '*.ts'),
        path.join(__dirname, '..', 'controllers', '*.ts'),
        path.join(__dirname, '..', 'models', 'entities', '*.ts')
    ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};