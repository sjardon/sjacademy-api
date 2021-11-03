import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import { Section } from './entities/section.entity';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { CustomSectionInput } from './dto/custom-section.input';

@Resolver(() => Section)
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) {}

  @Mutation(() => Section)
  async createSection(
    @Args('createSectionInput') createSectionInput: CreateSectionInput,
  ) {
    return await this.sectionsService.create(createSectionInput);
  }

  @Query(() => [Section], { name: 'sectionsByCourse' })
  findByCourse(
    @Args('customSectionInput') customSectionInput: CustomSectionInput,
  ) {
    return this.sectionsService.findByCourse(customSectionInput.courseId);
  }

  @Query(() => Section, { name: 'section' })
  async findOne(
    @Args('customSectionInput') customSectionInput: CustomSectionInput,
  ) {
    return await this.sectionsService.findOne(customSectionInput._id);
  }

  @Mutation(() => Section)
  updateSection(
    @Args('updateSectionInput') updateSectionInput: UpdateSectionInput,
  ) {
    return this.sectionsService.update(
      updateSectionInput._id,
      updateSectionInput,
    );
  }

  @Mutation(() => Section)
  removeSection(
    @Args('customSectionInput') customSectionInput: CustomSectionInput,
  ) {
    return this.sectionsService.remove(customSectionInput._id);
  }
}
