import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { pino } from 'pino'

import userRouter from '@/routes/user.routes'
import { setupSwagger } from './config/swagger'

import dataSource from '@/config/typeorm.config'
import 'reflect-metadata'


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
app.use('/health-check', (req, res) => {
    return res.status(200).send({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Server is healthy',
    })
})
app.use('/api/v1/users', userRouter)

// Swagger
setupSwagger(app)

// Error handling middleware

export { app, logger }