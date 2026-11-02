import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceRequestDocument extends Document {
  restaurantSlug: string;
  tableNumber: string;
  type: 'Water' | 'Extra Cutlery & Napkins' | 'Call Waiter' | 'Bill Receipt' | 'Cleaning';
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema = new Schema<IServiceRequestDocument>(
  {
    restaurantSlug: { type: String, required: true, index: true },
    tableNumber: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['Water', 'Extra Cutlery & Napkins', 'Call Waiter', 'Bill Receipt', 'Cleaning'],
      default: 'Call Waiter',
    },
    resolved: { type: Boolean, default: false, index: true },
    resolvedBy: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const ServiceRequestModel = mongoose.models.ServiceRequest || mongoose.model<IServiceRequestDocument>('ServiceRequest', ServiceRequestSchema);
