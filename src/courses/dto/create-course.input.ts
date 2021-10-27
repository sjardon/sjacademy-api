import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateCourseInput {
  @IsNotEmpty({
    message: 'Title is empty',
  })
  @MaxLength(100, {
    message: 'Title is too long',
  })
  @Field()
  name: string;

  @IsNotEmpty({
    message: 'Description is empty',
  })
  @MaxLength(500, {
    message: 'Description is too long',
  })
  @Field({ nullable: true })
  description: string;

  @Field(() => Float, { nullable: true })
  price: number;

  teachers: User[];
}
