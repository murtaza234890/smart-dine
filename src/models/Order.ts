import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../types/dining';

export interface IOrderDocument extends Document {
  orderNumber: string;
  restaurantSlug: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    id: string;
    menuItemId: string;
    name: string;
    basePrice: number;
    quantity: number;
    selectedAddons: Array<{
      groupId: string;
      groupTitle: string;
      optionId: string;
      optionName: string;
      priceDelta: number;
    }>;
    specialInstructions?: string;
    itemTotal: number;
    station: string;
  }>;
  subtotal: number;
  taxAmount: number;
  serviceCharges: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  estimatedPrepTimeMinutes: number;
  placedAt: string;
  acceptedAt?: string;
  preparedAt?: string;
  servedAt?: string;
  feedbackGiven?: boolean;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, index: true },
    restaurantSlug: { type: String, default: 'haveli', index: true },
    tableNumber: { type: String, required: true, index: true },
    customerName: { type: String },
    customerPhone: { type: String },
    items: [
      {
        id: String,
        menuItemId: String,
        name: String,
        basePrice: Number,
        quantity: Number,
        selectedAddons: [
          {
            groupId: String,
            groupTitle: String,
            optionId: String,
            optionName: String,
            priceDelta: Number,
          },
        ],
        specialInstructions: String,
        itemTotal: Number,
        station: String,
      },
    ],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    serviceCharges: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH_AT_COUNTER', 'CASH_AT_TABLE', 'JAZZCASH', 'EASYPAISA', 'BANK_CARD'],
      default: 'CASH_AT_TABLE',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PENDING_VERIFICATION', 'PAID', 'REFUNDED'],
      default: 'UNPAID',
    },
    specialInstructions: { type: String },
    estimatedPrepTimeMinutes: { type: Number, default: 15 },
    placedAt: { type: String, required: true },
    acceptedAt: { type: String },
    preparedAt: { type: String },
    servedAt: { type: String },
    feedbackGiven: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
