import { SetMetadata } from '@nestjs/common';

export const LessonArgName = (lessonArgName: string) =>
  SetMetadata('lessonArgName', lessonArgName);
