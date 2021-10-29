import { InputType, Int, Field, PartialType } from '@nestjs/graphql';
import { Section } from '../entities/section.entity';

@InputType()
export class CreateSectionInput {
  @Field()
  courseId: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int, { description: 'Section order' })
  order: number;
}
