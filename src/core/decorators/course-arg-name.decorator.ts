import { SetMetadata } from '@nestjs/common';

export const CourseArgName = (courseArgName: string) =>
  SetMetadata('courseArgName', courseArgName);
