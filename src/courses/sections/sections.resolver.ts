import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import { Section } from './entities/section.entity';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { CustomSectionInput } from './dto/custom-section.input';
import { SectionArgName } from 'src/core/decorators/section-arg-name.decorator';
import { UseGuards } from '@nestjs/common';
import { IsSectionTeacherGuard } from 'src/core/guards/is-section-teacher.guard';
import { IsCourseSectionTeacherGuard } from 'src/core/guards/is-course-section-teacher.guard';
import { CourseArgName } from 'src/core/decorators/course-arg-name.decorator';

@Resolver(() => Section)
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) {}

  @CourseArgName('createSectionInput')
  @UseGuards(IsCourseSectionTeacherGuard)
  @Mutation(() => Section)
  async createSection(
    @Args('createSectionInput') createSectionInput: CreateSectionInput,
  ) {
    return await this.sectionsService.create(createSectionInput);
  }

  @Query(() => [Section], { name: 'sectionsByCourse' })
  async findByCourse(
    @Args('customSectionInput') customSectionInput: CustomSectionInput,
  ) {
    return await this.sectionsService.findByCourse(customSectionInput.courseId);
  }

  @Query(() => Section, { name: 'section' })
  async findOne(
    @Args('customSectionInput') customSectionInput: CustomSectionInput,
  ) {
    return await this.sectionsService.findOne(customSectionInput._id);
  }

  @SectionArgName('updateSectionInput')
  @UseGuards(IsSectionTeacherGuard)
  @Mutation(() => Section)
  async updateSection(
    @Args('updateSectionInput') updateSectionInput: UpdateSectionInput,
  ) {
    return await this.sectionsService.update(
      updateSectionInput._id,
      updateSectionInput,
    );
  }

  @SectionArgName('customSectionInput')
  @UseGuards(IsSectionTeacherGuard)
  @Mutation(() => Section)
  async removeSection(
    @Args('customSectionInput') customSectionInput: CustomSectionInput,
  ) {
    return await this.sectionsService.remove(customSectionInput._id);
  }
}
