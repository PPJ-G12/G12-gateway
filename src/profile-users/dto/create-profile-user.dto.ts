import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateProfileUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  isActive?: boolean;

  @IsString()
  role: String 
}
