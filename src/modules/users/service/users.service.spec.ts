import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { AccountsService } from '../../accounts/service/accounts.service';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

const mockAccount = new Account();

mockAccount.id = '1';
mockAccount.balance = 100;

const mockUser = {
  id: '1',
  username: '@maria',
  password: 'Ergo9080',
  account: mockAccount,
};

const userResponse = {
  id: '1',
  username: '@maria',
  account: mockAccount,
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockAccountRepository = {
    save: jest.fn().mockResolvedValue({ id: '1', balance: 100 }),
    delete: jest.fn().mockResolvedValue(
      Promise.resolve({
        raw: [],
        affected: 1,
      }),
    ),
  };

  const mockUsersRepository = {
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([userResponse]),
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
        UsersService,
        AccountsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('test configuration', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('test user service methods', () => {
    it('should create a new user and return it with the accountid without the password', async () => {
      const dto = { username: '@maria', password: 'Ergo9080' };
      const response = await service.create(dto);

      expect(response).toEqual(userResponse);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should return all users', async () => {
      const response = await service.findAll();

      expect(response).toEqual([userResponse]);
      expect(response).toHaveLength(1);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should find a user by id', async () => {
      const response = await service.findOne('1');

      expect(response).toEqual(userResponse);
      expect(repository.find).toHaveBeenCalledTimes(2);
    });

    it('should update user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(userResponse);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        id: '1',
        username: '@mari',
        password: '',
        account: mockUser.account,
      });

      const dto = { username: '@mari' };
      const response = await service.update('1', dto);

      expect(response).toEqual({ ...userResponse, username: '@mari' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should be possible to remove a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);

      const response = await service.remove('1');

      expect(response).toEqual('Usuário removido com sucesso!');
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
