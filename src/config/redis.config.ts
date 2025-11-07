import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Configuration for Redis connection
const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || 'default',
}

const redisUrl = process.env.REDIS_URL || `redis://${redisConfig.username}:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`;

const redisClient = new Redis(redisUrl);

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;