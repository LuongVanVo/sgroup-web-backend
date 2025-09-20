import { userRegistry } from "@/routes/user.routes";
import { responseRegistry } from "@/api-docs/openAPIResponseBuilders";
import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { healthCheckRegistry } from "@/routes/healthCheck.routes";
import dotenv from 'dotenv'
dotenv.config()

export function generateOpenAPIDocument() {
    const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, responseRegistry])
    const generator = new OpenApiGeneratorV3(registry.definitions)

    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "SGroup Web Backend API",
            description: "API documentation for SGroup Web Backend"
        },
        servers: [
            {
                url: process.env.URL_SUMMARY as string,
            }
        ]
    })
}