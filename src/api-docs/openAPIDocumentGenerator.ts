import { userRegistry } from "@/routes/user.routes";
import { responseRegistry } from "@/api-docs/openAPIResponseBuilders";
import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { healthCheckRegistry } from "@/routes/healthCheck.routes";
import dotenv from 'dotenv'
import { authRegistry } from "@/routes/auth.routes";
import { projectRegistry } from "@/routes/project.routes";
import { boardRegistry } from "@/routes/board.routes";
dotenv.config()

export function generateOpenAPIDocument() {
    const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, responseRegistry, authRegistry, projectRegistry, boardRegistry])
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