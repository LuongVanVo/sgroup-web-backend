import 'reflect-metadata'
import dotenv from 'dotenv'
import { app, logger } from '@/server'
dotenv.config()

const server = app.listen(process.env.PORT, () => {
    const { HOST, PORT } = process.env
    if (!HOST || !PORT) {
        logger.error('HOST or PORT is not defined in environment variables')
        process.exit(1)
    }
    logger.info(`Server is running on: http://${HOST}:${PORT}`)
    logger.info(`API docs available at: http://${HOST}:${PORT}/api-docs`)

})

const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down ...`)
    server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))