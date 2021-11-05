import { InputType, PickType, Field } from '@nestjs/graphql';
import { UpdateSectionInput } from './update-section.input';

@InputType()
export class CustomSectionInput extends PickType(
  UpdateSectionInput,
  ['_id', 'courseId'],
  InputType,
) {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  courseId: string;
}
