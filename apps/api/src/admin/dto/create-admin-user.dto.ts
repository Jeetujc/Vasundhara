import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';
  
  import { Role } from '../../generated/prisma/client.js';
  
  export class CreateAdminUserDto {
    @IsString()
    @MinLength(2)
    name!: string;
  
    @IsString()
    @Matches(/^\d{12}$/, {
      message: 'Aadhaar must contain exactly 12 digits',
    })
    aadharId!: string;
  
    @IsString()
    @Matches(/^[6-9]\d{9}$/, {
      message: 'Mobile number must contain exactly 10 digits',
    })
    mobileNo!: string;
  
    @IsOptional()
    @IsDateString()
    dob?: string;
  
    @IsEnum(Role)
    role!: Role;
  
    @IsOptional()
    @IsString()
    organizationId?: string;
  
    @IsOptional()
    @IsString()
    stateId?: string;
  
    @IsOptional()
    @IsString()
    districtId?: string;
  
    @IsOptional()
    @IsString()
    tehsilId?: string;
  
    @IsString()
    @MinLength(8)
    password!: string;
  }