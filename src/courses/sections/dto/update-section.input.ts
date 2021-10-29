import { CreateSectionInput } from './create-section.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSectionInput extends PartialType(CreateSectionInput) {
  @Field()
  _id: string;
}
