import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

const mockAccount = new Account();
const mockUser = {
  id: '1',
  username: '@maria',
  accountId: mockAccount,
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockImplementation(() => Promise.resolve([mockUser])),
    findOneBy: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
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
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
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
    it('should create a new user and return it with the token and accountid without the password', async () => {
      const dto = { username: '@maria', password: 'Ergo9080' };
      const response = await service.create(dto);

      expect(response).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  it('should return all users', async () => {
    const response = await service.findAll();

    expect(response).toEqual([mockUser]);
    expect(response).toHaveLength(1);
    expect(repository.find).toHaveBeenCalledTimes(1);
  });

  it('should find a user by id', async () => {
    const response = await service.findOne('1');

    expect(response).toEqual(mockUser);
    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should update user', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);
    jest.spyOn(repository, 'save').mockResolvedValueOnce({
      id: '1',
      username: '@mari',
      password: '',
      accountId: mockUser.accountId,
    });

    const dto = { username: '@mari' };
    const response = await service.update('1', dto);

    expect(response).toEqual({ ...mockUser, username: '@mari' });
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
