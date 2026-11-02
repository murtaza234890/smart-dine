import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  restaurantSlug: string;
  name: string;
  nameUrdu: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    restaurantSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    nameUrdu: { type: String, default: '' },
    icon: { type: String, default: '🍽️' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
