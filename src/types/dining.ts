export type UserRole = 'customer' | 'waiter' | 'kitchen' | 'admin' | 'super_admin';

export type KitchenStation = 'all' | 'grill' | 'fryer' | 'beverage' | 'pizza' | 'dessert';

export type OrderStatus = 
  | 'PENDING'       // Customer placed, waiting for waiter/cashier accept
  | 'ACCEPTED'      // Waiter accepted, routed to kitchen
  | 'PREPARING'     // Kitchen cooking
  | 'READY'         // Food cooked, ready for waiter to pick up
  | 'SERVED'        // Delivered to customer table
  | 'COMPLETED'     // Bill paid, dining closed
  | 'CANCELLED';

export type PaymentMethod = 
  | 'CASH_AT_COUNTER'
  | 'CASH_AT_TABLE'
  | 'JAZZCASH'
  | 'EASYPAISA'
  | 'BANK_CARD';

export type PaymentStatus = 'UNPAID' | 'PENDING_VERIFICATION' | 'PAID' | 'REFUNDED';

export interface ItemVariantOption {
  id: string;
  name: string;
  priceDelta: number; // e.g. 100 for +Rs. 100
}

export interface ItemVariantGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect?: number;
  options: ItemVariantOption[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameUrdu: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  station: KitchenStation;
  variantGroups: ItemVariantGroup[];
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string;
}

export interface SelectedAddon {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; // unique cart line id
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
  itemTotal: number;
  station: KitchenStation;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "#1042"
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
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
  placedAt: string; // ISO string
  acceptedAt?: string;
  preparedAt?: string;
  servedAt?: string;
  feedbackGiven?: boolean;
}

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  activeOrderId?: string;
  qrCodeUrl: string;
}

export interface ServiceRequest {
  id: string;
  tableNumber: string;
  type: 'Water' | 'Extra Cutlery & Napkins' | 'Call Waiter' | 'Bill Receipt' | 'Cleaning';
  requestedAt: string;
  resolved: boolean;
}

export interface CustomerReview {
  id: string;
  orderNumber: string;
  tableNumber: string;
  foodRating: number;
  serviceRating: number;
  cleanlinessRating: number;
  overallRating: number;
  comment: string;
  date: string;
  wantsGoogleReviewRedirect?: boolean;
}
