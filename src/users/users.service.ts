import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      const { name, email, password } = createUserInput;

      const userExist = await this.userModel.findOne({
        $or: [{ name }, { email }],
      });

      if (userExist) {
        throw new BadRequestException('User already exists');
      }

      createUserInput.password = await bcrypt.hash(password, 10);

      return await this.userModel.create(createUserInput);
    } catch (thrownError) {
      await session.abortTransaction();

      if (thrownError instanceof BadRequestException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<User[] | undefined> {
    return await this.userModel.find();
  }

  async findOne(_id: string): Promise<User | undefined> {
    return await this.userModel.findOne({ _id });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      return await this.userModel
        .findByIdAndUpdate({ _id }, updateUserInput)
        .exec();
    } catch (thrownError) {
      await session.abortTransaction();
      throw new InternalServerErrorException();
    } finally {
      session.endSession();
    }
  }

  async remove(_id: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const removedUser = await this.userModel.findOneAndDelete({ _id });

      if (!removedUser) {
        throw new NotFoundException();
      }

      this.eventEmitter.emit('user.removed', removedUser);
      return removedUser;
    } catch (thrownError) {
      await session.abortTransaction();

      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      session.endSession();
    }
  }
}
