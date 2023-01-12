import * as dotenv from 'dotenv';

dotenv.config();
if (!process.env.SECRET_KEY) throw new Error('Secret Key Undefined');
if (!process.env.NAMESPACE) throw new Error('Namespace Undefined');
if (!process.env.DATABASE_URL) throw new Error('Database Url Undefined');

export const mongodbURL = process.env.DATABASE_URL;
export const secretKey = process.env.SECRET_KEY;
export const namespace = process.env.NAMESPACE;
