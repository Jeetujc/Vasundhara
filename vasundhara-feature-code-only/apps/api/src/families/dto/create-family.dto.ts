import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  projectId!: string;

  @IsString()
  familyReference!: string;

  @IsOptional()
  @IsString()
  headOfFamily?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  numberOfMembers?: number;

  @IsOptional()
  @IsBoolean()
  displaced?: boolean;
}
