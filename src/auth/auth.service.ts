import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredintialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredintialsDto: AuthCredintialsDto): Promise<void> {
    return this.userRepository.signUp(authCredintialsDto);
  }

  async signIn(
    authCredintialsDto: AuthCredintialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredintialsDto,
    );

    if (!username) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
