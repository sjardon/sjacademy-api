import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @Field()
  sectionId: string;

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
  @Field({ nullable: true })
  description: string;

  @Field()
  video: string;

  @IsInt({
    message: 'Order have to by an integer',
  })
  @IsPositive({
    message: 'Order have to by positive',
  })
  @Field(() => Int, { description: 'Lesson order' })
  order: number;
}
