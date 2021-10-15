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
    // It's good practice override methods of this form?
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

  // it('creates a new user', async () => {
  //   const toCreateUser = {
  //     name: 'Santiago J',
  //     password: 'strongPass',
  //     email: 's@mail.com',
  //   } as CreateUserInput;

  //   const createdUser = await service.create(toCreateUser);

  //   expect(createdUser).toBeDefined();
  // });

  it('throw exception when user email its repeated', async (done) => {
    const toCreateUser = {
      name: 'Santiago J',
      password: 'strongPass',
      email: 's@mail.com',
    } as CreateUserInput;

    fakeUserModel.findOne = jest.fn();
    fakeUserModel.findOne.mockResolvedValue(toCreateUser);

    // await expect(service.create(toCreateUser)).rejects.toBeInstanceOf(
    //   BadRequestException,
    // );

    // console.log('first');
    // expect(async () => await service.create(toCreateUser)).toThrow();

    // service.create(toCreateUser).catch((err) => {
    //   console.log(err instanceof BadRequestException);
    //   // expect(err).toBeInstanceOf(BadRequestException);
    //   expect(err).toEqual(new BadRequestException('User already exists'));
    //   done();
    // });

    // service.create(toCreateUser).catch((err) => {
    //   console.log(err);
    //   done();
    // });
    expect.assertions(1);

    try {
      await service.create(toCreateUser);
      console.log('no catch');
    } catch (err) {
      expect(err).not.toBeNull();
    } finally {
      console.log('ended');
    }
  });
});
