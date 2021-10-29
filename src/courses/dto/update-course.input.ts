import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { CustomUserInput } from 'src/users/dto/custom-user.input';
import { Course } from '../entities/course.entity';

@InputType()
export class UpdateCourseInput extends PartialType(
  OmitType(Course, ['teachers', 'sections']),
  InputType,
) {
  @Field()
  _id: string;
}
