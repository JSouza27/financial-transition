import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { Account } from '../../accounts/entities/account.entity';

const mockAccount = new Account();
const mockUser = {
  id: '1',
  username: '@maria',
  accountId: mockAccount,
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ username: '@mari', ...mockUser }),
    remove: jest.fn().mockResolvedValue('Usuário removido com sucesso!'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('test configuration', () => {
    it('should controller be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('test controller methods', () => {
    const dto = { username: '@maria', password: 'Ergo9080' };
    it('should create a user', async () => {
      const response = await controller.create(dto);

      expect(response).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should fetch all users', async () => {
      const response = await controller.findAll();

      expect(response).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should search for user by id', async () => {
      const response = await controller.findOne('1');

      expect(response).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should be possible to update user information', async () => {
      const data = { username: '@mari' };
      const response = await controller.update('1', data);

      expect(response).toEqual({ username: '@mari', ...mockUser });
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should be possible to remove a user', async () => {
      const response = await controller.remove('1');

      expect(response).toEqual('Usuário removido com sucesso!');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
