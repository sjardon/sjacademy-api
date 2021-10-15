import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float, { nullable: true })
  price: number;

  teachers: User[];
}
