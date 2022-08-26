import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../db/entities/user.entity';
import { LoginDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LogService } from '../services/log/log.service';
import { JwtService } from '@nestjs/jwt';
import { EnumStatus } from '../enum/enum-status';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new LogService(AuthService.name);
  constructor(
    @Inject('USERS_REPOSITORY')
    private userDB: typeof User,
    private jwtService: JwtService,
  ) {}
  async api_login(loginDto: LoginDto) {
    const tag = this.api_login.name;
    try {
      const res = {
        resCode: EnumStatus.success,
        resData: await this.login(loginDto),
        msg: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto) {
    const tag = this.login.name;
    try {
      const email = loginDto.email;
      const password = loginDto.password;
      const result = await this.userDB.findOne({
        where: {
          // attribute: ['email', 'password'],
          email: email,
        },
      });
      if (!result) throw new UnauthorizedException();
      // const passwordDB = result.password;
      this.logger.debug(`${tag} ->`, result.password);
      const isMatch = await bcrypt.compare(password, result.password);

      if (!isMatch) throw new UnauthorizedException();
      const jwt = await this.jwtService.signAsync({
        userId: result.user_id,
        email: result.email,
        role: result.role,
      });

      return jwt;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUserByJwt(payload: JwtPayload) {
    this.logger.debug('validateUserByJwt');
    const user = await this.userDB.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
