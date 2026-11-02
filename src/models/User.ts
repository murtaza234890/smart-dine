import mongoose, { Schema, Document } from 'mongoose';

export type StaffRole = 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'MANAGER' | 'WAITER' | 'KITCHEN_STAFF';

export interface IUserDocument extends Document {
  restaurantSlug: string;
  branchId?: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  posPin: string; // 4-digit quick terminal PIN (e.g. "1234")
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    restaurantSlug: { type: String, required: true, index: true },
    branchId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'MANAGER', 'WAITER', 'KITCHEN_STAFF'],
      default: 'WAITER',
      index: true,
    },
    posPin: { type: String, default: '1234' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
