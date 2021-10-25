import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserModel;
  let fakeUsers: User[];

  beforeEach(async () => {
    fakeUsers = [];
    fakeUserModel = {
      findOne: async (filter?) => {
        if (filter) {
          const { name } = filter?.$or?.[0];
          const { email } = filter?.$or?.[1];

          const [filteredUser] = fakeUsers.filter((user) => {
            return user.name === name || user.email === email;
          });

          return filteredUser;
        }

        return undefined;
      },

      create: async (user) => {
        fakeUsers.push(user);
        return user;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: fakeUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user', async () => {
    const toCreateUser = {
      name: 'Santiago J',
      password: 'strongPass',
      email: 's@mail.com',
    } as CreateUserInput;

    const createdUser = await service.create(toCreateUser);

    expect(createdUser).toBeDefined();
  });

  it('throw exception when user email its repeated', async () => {
    const toCreateUser = {
      name: 'Santiago J',
      password: 'strongPass',
      email: 's@mail.com',
    } as CreateUserInput;

    fakeUserModel.findOne = jest.fn();
    fakeUserModel.findOne.mockResolvedValue(toCreateUser);

    service.create(toCreateUser).catch((thrownError) => {
      const expectedError = new BadRequestException('User already exists');
      expect(thrownError).toEqual(expectedError);
    });
  });
});
