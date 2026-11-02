import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  restaurantSlug: string;
  orderNumber: string;
  tableNumber: string;
  foodRating: number;
  serviceRating: number;
  cleanlinessRating: number;
  overallRating: number;
  comment: string;
  wantsGoogleReviewRedirect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    restaurantSlug: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true },
    tableNumber: { type: String, required: true },
    foodRating: { type: Number, min: 1, max: 5, default: 5 },
    serviceRating: { type: Number, min: 1, max: 5, default: 5 },
    cleanlinessRating: { type: Number, min: 1, max: 5, default: 5 },
    overallRating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, default: '' },
    wantsGoogleReviewRedirect: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);
