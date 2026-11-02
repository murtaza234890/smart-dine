import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurantDocument extends Document {
  name: string;
  slug: string;
  tagline: string;
  city: string;
  ownerName: string;
  ownerPhone: string;
  wifiSsid: string;
  wifiPassword: string;
  googleReviewUrl: string;
  taxRatePercent: number;
  serviceChargePercent: number;
  currency: string;
  tableCount: number;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  subscriptionStatus: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'EXPIRED';
  fbrPosEnabled: boolean;
  branches: Array<{
    name: string;
    city: string;
    address: string;
    phone: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: '' },
    city: { type: String, default: 'Lahore' },
    ownerName: { type: String, default: 'Restaurant Owner' },
    ownerPhone: { type: String, default: '0300-XXXXXXX' },
    wifiSsid: { type: String, default: '' },
    wifiPassword: { type: String, default: '' },
    googleReviewUrl: { type: String, default: '' },
    taxRatePercent: { type: Number, default: 16.0 },
    serviceChargePercent: { type: Number, default: 4.0 },
    currency: { type: String, default: 'Rs.' },
    tableCount: { type: Number, default: 12 },
    plan: {
      type: String,
      enum: ['Starter', 'Professional', 'Enterprise'],
      default: 'Enterprise',
    },
    subscriptionStatus: {
      type: String,
      enum: ['ACTIVE', 'TRIAL', 'PAST_DUE', 'EXPIRED'],
      default: 'ACTIVE',
    },
    fbrPosEnabled: { type: Boolean, default: true },
    branches: [
      {
        name: String,
        city: String,
        address: String,
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

export const RestaurantModel = mongoose.models.Restaurant || mongoose.model<IRestaurantDocument>('Restaurant', RestaurantSchema);
