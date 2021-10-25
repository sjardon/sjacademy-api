import { InputType, PickType } from '@nestjs/graphql';
import { Course } from '../entities/course.entity';

@InputType()
export class CustomCourseInput extends PickType(Course, ['_id'], InputType) {}
