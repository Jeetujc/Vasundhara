import {
  IsNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @Length(2, 50)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  description?: string;

  @IsString()
  @IsNotEmpty()
  stateId!: string;

  @IsString()
  @IsNotEmpty()
  districtId!: string;

  @IsOptional()
  @IsString()
  proposedArea?: string;
}
