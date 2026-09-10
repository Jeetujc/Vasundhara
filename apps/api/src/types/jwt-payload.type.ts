import { Role } from '../generated/prisma/client.js';

export interface JwtPayload {
  sub: string;
  role: Role;
}