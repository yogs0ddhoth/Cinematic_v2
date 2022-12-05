import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.SECRET_KEY);

export const jwtConstants = {
  secret: process.env.SECRET_KEY,
};
export const namespace = process.env.NAMESPACE;
