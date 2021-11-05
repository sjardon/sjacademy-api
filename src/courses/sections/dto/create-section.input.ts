import { InputType, Int, Field, PartialType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

@InputType()
export class CreateSectionInput {
  @Field()
  courseId: string;

  @IsNotEmpty({
    message: 'Name is empty',
  })
  @MaxLength(100, {
    message: 'Name is too long',
  })
  @Field()
  name: string;

  @IsNotEmpty({
    message: 'Description is empty',
  })
  @MaxLength(500, {
    message: 'Description is too long',
  })
  @Field()
  description: string;

  @IsInt({
    message: 'Order have to by an integer',
  })
  @IsPositive({
    message: 'Order have to by positive',
  })
  @Field(() => Int, { description: 'Section order' })
  order: number;
}
