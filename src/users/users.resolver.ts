import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { ValidationClassPipe } from 'src/core/pipes/validation-class.pipe';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ) {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('_id') _id: string) {
    return await this.usersService.findOne(_id);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async findMe(@CurrentUser() user: User) {
    return await this.usersService.findOne(user._id);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const updatedUser = await this.usersService.update(
      updateUserInput._id,
      updateUserInput,
    );
    return updatedUser;
  }

  @Mutation(() => User)
  async removeUser(@Args('_id') _id: string) {
    return await this.usersService.remove(_id);
  }
}
