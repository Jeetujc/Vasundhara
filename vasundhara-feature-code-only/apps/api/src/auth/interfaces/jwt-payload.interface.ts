import type { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  stateId?: string | null;
  districtId?: string | null;
}
