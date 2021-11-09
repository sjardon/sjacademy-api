import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

export type LessonDocument = Lesson & Document;

@Schema()
@ObjectType()
export class Lesson {
  @Field()
  _id: string;

  @IsNotEmpty({
    message: 'Name is empty',
  })
  @MaxLength(100, {
    message: 'Name is too long',
  })
  @Prop({ required: true })
  @Field()
  name: string;

  @IsNotEmpty({
    message: 'Description is empty',
  })
  @MaxLength(500, {
    message: 'Description is too long',
  })
  @Prop()
  @Field({ nullable: true })
  description: string;

  @Prop({ required: false })
  @Field()
  video: string;

  @IsInt({
    message: 'Order have to by an integer',
  })
  @IsPositive({
    message: 'Order have to by positive',
  })
  @Prop()
  @Field(() => Int, { description: 'Lesson order' })
  order: number;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  updatedAt: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
