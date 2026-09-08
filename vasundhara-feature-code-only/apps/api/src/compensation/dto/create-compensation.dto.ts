import { IsNumberString, IsString } from 'class-validator';

export class CreateCompensationDto {
  @IsString()
  projectId!: string;

  @IsString()
  parcelId!: string;

  @IsString()
  familyId!: string;

  @IsNumberString()
  assessedAmount!: string;
}
