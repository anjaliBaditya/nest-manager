import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredintialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password is too weak',
  })
  password: string;
}
