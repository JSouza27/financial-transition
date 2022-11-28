import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const res = await this.accountRepository.save(createAccountDto);

    return res;
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });

    if (!account) {
      throw new HttpException('Conta não encontrada.', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const userAccount = await this.findOne(id);

    const updatedAccount = await this.accountRepository.save({
      ...userAccount,
      updateAccountDto,
    });

    return updatedAccount;
  }

  async remove(id: string): Promise<string> {
    const res = await this.accountRepository.delete(id);

    if (!!res.affected) return 'Conta removida com sucesso.';

    throw new HttpException(
      'Houve um erro ao remover o usuário.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
