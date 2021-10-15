import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
// import {} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'User name' })
  name: string;

  @Field()
  password: string;

  @IsEmail(
    {},
    {
      message: 'Error Email',
    },
  )
  @Field()
  email: string;

  @Field({ description: 'Profile picture', nullable: true })
  picture: string;
}
