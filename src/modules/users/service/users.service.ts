import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create(createUserDto);
    const res = await this.userRepository.save(user);

    if (!!res) {
      const dto = new UserResponseDto();

      dto.id = res.id;
      dto.username = res.username;
      dto.accountId = res.accountId;

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
    const res = await this.userRepository.findOneBy({ id });

    if (!res) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    return res;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    const res = await this.userRepository.save({ ...user, ...updateUserDto });

    const dto = new UserResponseDto();

    dto.accountId = res.accountId;
    dto.id = res.id;
    dto.username = res.username;

    return dto;
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id);

    const res = await this.userRepository.delete(id);

    if (!!res.affected) return 'Usuário removido com sucesso!';

    throw new HttpException(
      'Houve um erro ao remover o usuário.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
