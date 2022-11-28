import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { AccountsService } from '../../accounts/service/accounts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AccountsService))
    private readonly accountService: AccountsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const account = await this.accountService.create({ balance: 100 });
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const res = await this.userRepository.save({
      account: account,
      username: createUserDto.username,
      password: hash,
    });

    if (!!res) {
      const dto = new UserResponseDto();

      dto.id = res.id;
      dto.username = res.username;
      dto.account = res.account;

      return dto;
    }

    throw new HttpException(
      'Ocorreu um erro ao cadastrar o usuário.',
      HttpStatus.BAD_REQUEST,
    );
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const res = await this.userRepository.find({
      select: { username: true, id: true },
      relations: { account: true },
      where: { id },
    });

    if (!res) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    return res[0];
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    const res = await this.userRepository.save({ ...user, ...updateUserDto });

    const dto = new UserResponseDto();

    dto.account = res.account;
    dto.id = res.id;
    dto.username = res.username;

    return dto;
  }

  async remove(id: string): Promise<string> {
    const user = await this.findOne(id);
    const res = await this.userRepository.delete(id);

    await this.accountService.remove(user.account.id);

    if (!!res.affected) return 'Usuário removido com sucesso!';

    throw new HttpException(
      'Houve um erro ao remover o usuário.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
