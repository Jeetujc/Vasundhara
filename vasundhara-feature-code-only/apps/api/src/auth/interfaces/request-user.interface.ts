import type { Role } from '@prisma/client';

export interface RequestUser {
  userId: string;
  email: string;
  role: Role;
  stateId?: string | null;
  districtId?: string | null;
}
