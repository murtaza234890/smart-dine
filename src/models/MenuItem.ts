import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItemDocument extends Document {
  restaurantSlug: string;
  categoryId: string;
  name: string;
  nameUrdu: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isPopular: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  station: string;
  variantGroups: Array<{
    id: string;
    title: string;
    required: boolean;
    maxSelect?: number;
    options: Array<{
      id: string;
      name: string;
      priceDelta: number;
    }>;
  }>;
}

const MenuItemSchema = new Schema<IMenuItemDocument>(
  {
    restaurantSlug: { type: String, default: 'haveli', index: true },
    categoryId: { type: String, required: true },
    name: { type: String, required: true },
    nameUrdu: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    isVeg: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isChefSpecial: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    prepTimeMinutes: { type: Number, default: 15 },
    station: { type: String, default: 'grill' },
    variantGroups: [
      {
        id: String,
        title: String,
        required: Boolean,
        maxSelect: Number,
        options: [
          {
            id: String,
            name: String,
            priceDelta: Number,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MenuItemModel = mongoose.models.MenuItem || mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);
