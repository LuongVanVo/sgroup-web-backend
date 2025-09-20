import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { pino } from 'pino'

import userRouter from '@/routes/user.routes'
import healthCheckRouter from '@/routes/healthCheck.routes'
import { setupSwagger } from '@/api-docs/swagger'

import dataSource from '@/config/typeorm.config'
import 'reflect-metadata'
import { openAPIRouter } from './api-docs/openAPIRouter'
import { errorHandler } from './middlewares/errorHandler'


dataSource
    .initialize()
    .then(() => {
        console.log('Data Source has been initialized!')
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err)
    })

const app: Express = express()
const logger = pino({ name: 'server backend start' })

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
}))

app.use(helmet())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/healthy-check', healthCheckRouter)
app.use('/api/v1/users', userRouter)

// Swagger
setupSwagger(app)
app.use(openAPIRouter)

// Error handling middleware
app.use(errorHandler)

export { app, logger }