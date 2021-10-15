import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ description: 'User id to update' })
  _id: string;

  @Field({ description: 'User name', nullable: true })
  name: string;

  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @Field({ description: 'Profile picture', nullable: true })
  picture: string;

  @Field({ nullable: true })
  isTeacher: boolean;
}
