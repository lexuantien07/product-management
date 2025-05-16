import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  price: number;

  @Prop()
  category: string;

  @Prop()
  subcategory: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likedBy: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
