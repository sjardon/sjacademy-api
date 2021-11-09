import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { CustomLessonInput } from './dto/custom-lesson.input';

@Resolver(() => Lesson)
export class LessonsResolver {
  constructor(private readonly lessonsService: LessonsService) {}

  @Mutation(() => Lesson)
  async createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    return await this.lessonsService.create(createLessonInput);
  }

  @Query(() => Lesson, { name: 'lesson' })
  async findOne(
    @Args('customLessonInput') customLessonInput: CustomLessonInput,
  ) {
    return await this.lessonsService.findOne(customLessonInput._id);
  }

  @Query(() => [Lesson], { name: 'lessonsBySection' })
  findBySection(
    @Args('customLessonInput') customLessonInput: CustomLessonInput,
  ) {
    return this.lessonsService.findBySection(customLessonInput.sectionId);
  }

  @Mutation(() => Lesson)
  updateLesson(
    @Args('updateLessonInput') updateLessonInput: UpdateLessonInput,
  ) {
    return this.lessonsService.update(updateLessonInput._id, updateLessonInput);
  }

  @Mutation(() => Lesson)
  removeLesson(
    @Args('customLessonInput') customLessonInput: CustomLessonInput,
  ) {
    return this.lessonsService.remove(customLessonInput._id);
  }
}
