import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { PrismaService } from '../prisma/prisma.service.js';
  import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
  
  import { Role } from '../generated/prisma/client.js';
  
  import * as argon2 from 'argon2';
  
  @Injectable()
  export class AdminUsersService {
    constructor(private readonly prisma: PrismaService) {}
  
    async create(dto: CreateAdminUserDto) {
      // --------------------------------------------------
      // Validate hierarchy according to role
      // --------------------------------------------------
  
      let organizationId = dto.organizationId;
      if (dto.role !== Role.PUBLIC_USER && !organizationId) {
        const defaultOrg = await this.prisma.organization.findFirst();
        if (defaultOrg) {
          organizationId = defaultOrg.id;
        } else {
          throw new BadRequestException(
            'organizationId is required for authority accounts',
          );
        }
      }
  
      if (
        dto.role === Role.STATE_OFFICER &&
        !dto.stateId
      ) {
        throw new BadRequestException(
          'stateId is required for STATE_OFFICER',
        );
      }
  
      if (
        dto.role === Role.DISTRICT_OFFICER &&
        (!dto.stateId || !dto.districtId)
      ) {
        throw new BadRequestException(
          'stateId and districtId are required for DISTRICT_OFFICER',
        );
      }
  
      if (
        dto.role === Role.FIELD_OFFICER &&
        (!dto.stateId || !dto.districtId || !dto.tehsilId)
      ) {
        throw new BadRequestException(
          'stateId, districtId and tehsilId are required for FIELD_OFFICER',
        );
      }
  
      // --------------------------------------------------
      // Prevent invalid PUBLIC_USER creation here
      // --------------------------------------------------
  
      if (dto.role === Role.PUBLIC_USER) {
        throw new BadRequestException(
          'PUBLIC_USER must register through /auth/register',
        );
      }
  
      // --------------------------------------------------
      // Verify organization
      // --------------------------------------------------
  
      if (organizationId) {
        const organization = await this.prisma.organization.findUnique({
          where: {
            id: organizationId,
          },
        });
  
        if (!organization) {
          throw new NotFoundException(
            'Organization not found',
          );
        }
      }
  
      // --------------------------------------------------
      // Verify state
      // --------------------------------------------------

      let resolvedStateId = dto.stateId;
      if (dto.stateId) {
        const state = await this.prisma.state.findFirst({
          where: {
            OR: [{ id: dto.stateId }, { code: dto.stateId }],
          },
        });

        if (!state) {
          throw new NotFoundException('State not found');
        }
        resolvedStateId = state.id;
      }
  
      // --------------------------------------------------
      // Verify district belongs to state
      // --------------------------------------------------

      let resolvedDistrictId = dto.districtId;
      if (dto.districtId) {
        const district = await this.prisma.district.findFirst({
          where: {
            OR: [{ id: dto.districtId }, { code: dto.districtId }],
          },
        });

        if (!district) {
          throw new NotFoundException(
            'District not found',
          );
        }

        if (
          resolvedStateId &&
          district.stateId !== resolvedStateId
        ) {
          throw new BadRequestException(
            'District does not belong to selected state',
          );
        }
        resolvedDistrictId = district.id;
      }
  
      // --------------------------------------------------
      // Verify tehsil belongs to district
      // --------------------------------------------------

      let resolvedTehsilId = dto.tehsilId;
      if (dto.tehsilId) {
        const tehsil = await this.prisma.tehsil.findFirst({
          where: {
            OR: [{ id: dto.tehsilId }, { code: dto.tehsilId }],
          },
        });

        if (!tehsil) {
          throw new NotFoundException(
            'Tehsil not found',
          );
        }

        if (
          resolvedDistrictId &&
          tehsil.districtId !== resolvedDistrictId
        ) {
          throw new BadRequestException(
            'Tehsil does not belong to selected district',
          );
        }
        resolvedTehsilId = tehsil.id;
      }
  
      // --------------------------------------------------
      // Check duplicate Aadhaar / mobile
      // --------------------------------------------------
  
      const existingUser =
        await this.prisma.user.findFirst({
          where: {
            OR: [
              {
                aadharId: dto.aadharId,
              },
              {
                mobileNo: dto.mobileNo,
              },
            ],
          },
        });
  
      if (existingUser) {
        throw new BadRequestException(
          'User with this Aadhaar or mobile number already exists',
        );
      }
  
      // --------------------------------------------------
      // Hash password
      // --------------------------------------------------
  
      const passwordHash = await argon2.hash(
        dto.password,
      );
  
      // --------------------------------------------------
      // Create user
      // --------------------------------------------------
  
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          aadharId: dto.aadharId,
          mobileNo: dto.mobileNo,
          dob: dto.dob
            ? new Date(dto.dob)
            : undefined,
          passwordHash,
  
          role: dto.role,
  
          organizationId:
            organizationId,
  
          stateId:
            resolvedStateId,

          districtId:
            resolvedDistrictId,

          tehsilId:
            resolvedTehsilId,
  
          isActive: true,
        },
  
        select: {
          id: true,
          name: true,
          aadharId: true,
          mobileNo: true,
          role: true,
          organizationId: true,
          stateId: true,
          districtId: true,
          tehsilId: true,
          isActive: true,
          createdAt: true,
        },
      });
  
      return user;
    }
  
    async findAll() {
      return this.prisma.user.findMany({
        where: {
          role: {
            not: Role.PUBLIC_USER,
          },
        },
  
        select: {
          id: true,
          name: true,
          aadharId: true,
          mobileNo: true,
          role: true,
          organizationId: true,
          stateId: true,
          districtId: true,
          tehsilId: true,
          isActive: true,
          createdAt: true,
        },
  
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
  }