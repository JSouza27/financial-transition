import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(() => ({ id: '1', username: '@maria' })),
    findAll: jest.fn(() => [{ id: '1', username: '@maria' }]),
    findOne: jest.fn(() => ({ id: '1', username: '@maria' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('test configuration', () => {
    it('should controller be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('test controller methods', () => {
    const dto = { username: 'Maria', password: 'Ergo9080' };
    it('should create a user', async () => {
      const response = await controller.create(dto);

      expect(response).toEqual({ id: '1', username: '@maria' });
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });

    it('should fetch all users', async () => {
      const response = await controller.findAll();

      expect(response).toEqual([{ id: '1', username: '@maria' }]);
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should search for user by id', async () => {
      const response = await controller.findOne('1');

      expect(response).toEqual({ id: '1', username: '@maria' });
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });
});
