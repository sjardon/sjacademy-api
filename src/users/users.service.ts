import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput) {
    const { name, email, password } = createUserInput;

    const userExist = await this.userModel.findOne({
      $or: [{ name }, { email }],
    });

    if (userExist) {
      throw new BadRequestException('User already exists');
    }

    createUserInput.password = await bcrypt.hash(password, 10);

    return await this.userModel.create(createUserInput);
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
    return await this.userModel
      .findByIdAndUpdate({ _id }, updateUserInput)
      .exec();
  }

  async remove(_id: string) {
    return await this.userModel.findOneAndDelete({ _id });
  }
}
