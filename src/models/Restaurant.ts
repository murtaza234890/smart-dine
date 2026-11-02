import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurantDocument extends Document {
  name: string;
  slug: string;
  tagline: string;
  branch: string;
  wifiSsid: string;
  wifiPassword: string;
  googleReviewUrl: string;
  taxRatePercent: number;
  serviceChargePercent: number;
  currency: string;
  tableCount: number;
  plan: string;
  fbrPosEnabled: boolean;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: '' },
    branch: { type: String, default: '' },
    wifiSsid: { type: String, default: '' },
    wifiPassword: { type: String, default: '' },
    googleReviewUrl: { type: String, default: '' },
    taxRatePercent: { type: Number, default: 16.0 },
    serviceChargePercent: { type: Number, default: 4.0 },
    currency: { type: String, default: 'Rs.' },
    tableCount: { type: Number, default: 12 },
    plan: { type: String, default: 'Professional' },
    fbrPosEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const RestaurantModel = mongoose.models.Restaurant || mongoose.model<IRestaurantDocument>('Restaurant', RestaurantSchema);
