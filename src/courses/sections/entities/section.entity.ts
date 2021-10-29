import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SectionDocument = Section & Document;

@Schema()
@ObjectType()
export class Section {
  @Field()
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  description: string;

  @Prop()
  @Field(() => Int, { description: 'Section order' })
  order: number;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  updatedAt: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
