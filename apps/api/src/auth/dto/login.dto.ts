import {
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\d{12}$/, {
    message: 'aadharId must be a valid 12-digit Aadhaar number',
  })
  aadharId!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}