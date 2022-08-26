import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { User } from '../db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LogService } from '../services/log/log.service';
import { EnumStatus } from '../enum/enum-status';
@Injectable()
export class UserService implements OnApplicationBootstrap {
  private logger = new LogService(UserService.name);
  constructor(
    @Inject('USERS_REPOSITORY')
    private userDB: typeof User,
  ) {}
  async onApplicationBootstrap() {
    // const user = {
    //   firstName: 'test',
    //   lastName: 'test',
    //   email: 'tests',
    //   password: 'profile',
    //   role: 0,
    // };
    const password = 'profile';
    const hash = '$2b$12$ddEEn98YhxihS2uLcu5YLOafbBkba1KvS1kc/Ne4lUYYmuxUjYn5C';
    const isMatch = await bcrypt.compare(password, hash);
    if (isMatch) {
      this.logger.debug('success');
    } else {
      this.logger.debug('failed');
    }
  }
  async api_register(createUserDto: CreateUserDto) {
    const tag = this.api_register.name;
    try {
      const email = createUserDto.email;
      const emailAlready = await this.userDB.findOne({
        where: {
          email: email,
        },
      });
      if (emailAlready) {
        const resErr = {
          resCode: EnumStatus.success,
          resData: 'email already exits',
          msg: '',
        };
        return resErr;
      }
      const data = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
      };
      const res = {
        resCode: EnumStatus.success,
        resData: await this.userDB.create(data),
        msg: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // async register(createUserDto: CreateUserDto) {
  //   const tag = this.register.name;
  //   try {
  //     const email = createUserDto.email;
  //     const emailAlready = await this.userDB.findOne({
  //       where: {
  //         email: email,
  //       },
  //     });
  //     if (emailAlready) return 'email already exits';
  //   } catch (error) {
  //     this.logger.error(`${tag} -> `, error);
  //     throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
