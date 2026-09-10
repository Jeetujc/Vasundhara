import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Matches(/^\d{12}$/, {
    message: 'aadharId must be a valid 12-digit Aadhaar number',
  })
  aadharId!: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'mobileNo must be a valid 10-digit Indian mobile number',
  })
  mobileNo!: string;

  @IsDateString()
  dob!: string;

  @IsString()
  @IsNotEmpty()
  stateId!: string;

  @IsString()
  @IsNotEmpty()
  districtId!: string;

  @IsString()
  @IsNotEmpty()
  tehsilId!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}