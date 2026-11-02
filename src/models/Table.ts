import mongoose, { Schema, Document } from 'mongoose';

export interface ITableDocument extends Document {
  restaurantSlug: string;
  tableNumber: string;
  capacity: number;
  section: 'Indoor Main Hall' | 'Rooftop Terrace' | 'Executive Family Lounge' | 'Patio Garden';
  status: 'available' | 'occupied' | 'reserved';
  activeOrderId?: string;
  qrToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITableDocument>(
  {
    restaurantSlug: { type: String, required: true, index: true },
    tableNumber: { type: String, required: true, index: true },
    capacity: { type: Number, default: 4 },
    section: {
      type: String,
      enum: ['Indoor Main Hall', 'Rooftop Terrace', 'Executive Family Lounge', 'Patio Garden'],
      default: 'Indoor Main Hall',
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
      index: true,
    },
    activeOrderId: { type: String },
    qrToken: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const TableModel = mongoose.models.Table || mongoose.model<ITableDocument>('Table', TableSchema);
