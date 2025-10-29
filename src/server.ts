import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { pino } from 'pino'

import userRouter from '@/routes/user.routes'
import authRouter from '@/routes/auth.routes'
import projectRouter from '@/routes/project.routes'
import boardRouter from '@/routes/board.routes'
import projectMemberRouter from '@/routes/projectMember.routes'

import healthCheckRouter from '@/routes/healthCheck.routes'
import { setupSwagger } from '@/api-docs/swagger'

import dataSource from '@/config/typeorm.config'
import 'reflect-metadata'
import { openAPIRouter } from './api-docs/openAPIRouter'
import { errorHandler } from './middlewares/errorHandler'

import session from 'express-session'
import passport from '@/config/passport.config'
import cookieParser from 'cookie-parser'

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
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(cookieParser());

// Import passport config
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(helmet())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/healthy-check', healthCheckRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/boards', boardRouter)
app.use('/api/v1/project-members', projectMemberRouter)

// Swagger
setupSwagger(app)
app.use(openAPIRouter)

// Error handling middleware
app.use(errorHandler)

export { app, logger }