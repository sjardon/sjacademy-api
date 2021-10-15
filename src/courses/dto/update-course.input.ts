import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { CustomUserInput } from 'src/users/dto/custom-user.input';
import { Course } from '../entities/course.entity';
// import { CreateCourseInput } from './create-course.input';

@InputType()
export class UpdateCourseInput extends PartialType(
  OmitType(Course, ['teachers']),
  InputType,
) {
  @Field()
  _id: string;
}
