import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredintialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(authCredintialsDto: AuthCredintialsDto): Promise<void> {
    const { username, password } = authCredintialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      if (e === '23505') throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(authCredintialsDto: AuthCredintialsDto) {
    const { username, password } = authCredintialsDto;
    const user = await this.findOne({
      where: { username },
    });

    if (user && (await user.validatePassword(password))) return user.username;
    else return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
