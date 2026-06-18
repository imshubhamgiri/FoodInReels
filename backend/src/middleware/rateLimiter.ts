import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import  redisClient  from '../db/redis';
import {RedisStore , type RedisReply} from 'rate-limit-redis';


// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

const skipRequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

const redisStore =function store(customPrefix:string){
    return new RedisStore({
    prefix:customPrefix,
    sendCommand: async( command ,...args: string[]) => await redisClient.call(command, ...args) as RedisReply,
    })
}




export const globalApiLimiter =  rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore('rl:global:'),
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

export const authLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  store:  redisStore('rl:auth:'),
});

export const refreshLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many token refresh attempts, please try again later.',
  },
  store: redisStore('rl:refresh:'),
});

export const actionLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please slow down.',
  },
  store:  redisStore('rl:action:'),
});
