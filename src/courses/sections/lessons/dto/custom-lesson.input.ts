import { InputType, PickType, Field } from '@nestjs/graphql';
import { UpdateLessonInput } from './update-lesson.input';

@InputType()
export class CustomLessonInput extends PickType(
  UpdateLessonInput,
  ['_id', 'sectionId'],
  InputType,
) {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  sectionId: string;
}
