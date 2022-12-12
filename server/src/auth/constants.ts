import * as dotenv from 'dotenv';

dotenv.config();
if (!process.env.SECRET_KEY) throw new Error('Secret Key Undefined');
if (!process.env.NAMESPACE) throw new Error('Namespace Undefined');

export const jwtConstants = {
  secret: process.env.SECRET_KEY,
};
export const namespace = process.env.NAMESPACE;
