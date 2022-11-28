import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../entities/account.entity';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: Repository<Account>;

  const mockAccountRepository = {
    save: jest.fn().mockResolvedValue({ id: '1', balance: 100 }),
    find: jest.fn().mockResolvedValue([{ id: '1', balance: 100 }]),
    findOneBy: jest.fn().mockResolvedValue({ id: '1', balance: 100 }),
    update: jest.fn().mockResolvedValue({ id: '1', balance: 250 }),
    delete: jest.fn().mockImplementation(() =>
      Promise.resolve({
        raw: [],
        affected: 1,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    repository = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  describe('test configuration', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('test account service methods', () => {
    it('should create an account successfully', async () => {
      const res = await service.create({ balance: 100 });

      expect(res).toEqual({ id: '1', balance: 100 });
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should return a list of accounts', async () => {
      const res = await service.findAll();

      expect(res).toEqual([{ id: '1', balance: 100 }]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an accounts through the id', async () => {
      const res = await service.findOne('1');

      expect(res).toEqual({ id: '1', balance: 100 });
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should update the account', async () => {
      const user = new User();

      user.id = '1';
      user.username = '@mari';
      user.password = 'Ergo9080@';

      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce({ id: '1', balance: 250, user });

      const data = { balance: 250 };
      const res = await service.update('1', data);

      expect(res).toEqual({ id: '1', balance: 250, user });
    });

    it('should be remove the account', async () => {
      const res = await service.remove('1');

      expect(res).toEqual('Conta removida com sucesso.');
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
