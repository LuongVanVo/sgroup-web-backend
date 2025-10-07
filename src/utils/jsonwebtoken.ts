import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET_KEY: Secret =
  typeof process.env.JWT_SECRET_KEY === 'string' && process.env.JWT_SECRET_KEY.length > 0 ? process.env.JWT_SECRET_KEY : 'default';
const JWT_EXPIRES_IN: string | number =
  typeof process.env.JWT_EXPIRES_IN === 'string' && process.env.JWT_EXPIRES_IN.length > 0
    ? process.env.JWT_EXPIRES_IN
    : '1d';

export const generateJwt = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  } as SignOptions);
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};