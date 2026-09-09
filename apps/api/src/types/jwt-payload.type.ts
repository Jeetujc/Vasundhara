import { Role } from '../generated/prisma/client.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}