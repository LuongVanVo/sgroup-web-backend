import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { statusCodes, reasonPhrases } from "@/utils/httpStatusCode";
import { z } from "zod";

export const responseRegistry = new OpenAPIRegistry()

// Success Response với Array
export const createSuccessArrayResponse = (itemRef: string, message: string) => ({
    description: message,
    content: {
        'application/json': {
            schema: z.object({
                status: z.number().int().describe('HTTP status code'),
                message: z.string().describe('Success message'),
                metadata: z.array(z.object({})).describe('Array of items')
            })
        }
    }
});

// Error Response Builder
export const createErrorResponse = (
    statusCode: number,
    reasonPhrase: string,
    errorMessage?: string
) => ({
    description: reasonPhrase,
    content: {
        'application/json': {
            schema: z.object({
                status: z.number().int().describe('HTTP status code'),
                message: z.string().describe('Error message'),
                error: z.string().optional().describe('Error details')
            })
        }
    }
});

// Common Error Responses
export const commonErrorResponses = {
    400: createErrorResponse(statusCodes.BAD_REQUEST, reasonPhrases.BAD_REQUEST),
    401: createErrorResponse(statusCodes.UNAUTHORIZED, reasonPhrases.UNAUTHORIZED),
    403: createErrorResponse(statusCodes.FORBIDDEN, reasonPhrases.FORBIDDEN),
    404: createErrorResponse(statusCodes.NOT_FOUND, reasonPhrases.NOT_FOUND),
    500: createErrorResponse(statusCodes.INTERNAL_SERVER_ERROR, reasonPhrases.INTERNAL_SERVER_ERROR)
};