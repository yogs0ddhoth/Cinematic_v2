import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.PRIVATE_KEY) throw new Error('Secret Key Undefined');
if (!process.env.NAMESPACE) throw new Error('Namespace Undefined');

export const privateKey = process.env.PRIVATE_KEY;
export const namespace = process.env.NAMESPACE;
