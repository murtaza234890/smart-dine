'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Order, 
  CartItem, 
  MenuItem, 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus, 
  RestaurantTable, 
  ServiceRequest, 
  CustomerReview,
  KitchenStation 
} from '../types/dining';
import { 
  RESTAURANT_INFO, 
  MENU_ITEMS, 
  INITIAL_TABLES, 
  INITIAL_ORDERS, 
  INITIAL_SERVICE_REQUESTS 
} from '../data/mockRestaurant';
import { soundFX } from '../utils/audio';

interface DineContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  menuItems: MenuItem[];
  tables: RestaurantTable[];
  orders: Order[];
  cart: CartItem[];
  serviceRequests: ServiceRequest[];
  reviews: CustomerReview[];
  activeOrder: Order | undefined;
  activeStationFilter: KitchenStation;
  setActiveStationFilter: (st: KitchenStation) => void;
  showWifiModal: boolean;
  setShowWifiModal: (val: boolean) => void;
  
  // Cart Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  
  // Order Actions
  placeOrder: (paymentMethod: PaymentMethod, specialInstructions?: string, splitCount?: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  
  // Service Request Actions
  callStaff: (type: ServiceRequest['type']) => void;
  resolveStaffRequest: (requestId: string) => void;
  
  // Kitchen Actions
  toggleItemAvailability: (itemId: string) => void;
  
  // Review Actions
  submitReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
  
  // Sound controls
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  playOrderBell: () => void;
}

const DineContext = createContext<DineContextType | undefined>(undefined);

export function DineProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [selectedTable, setSelectedTable] = useState<string>('04');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [reviews, setReviews] = useState<CustomerReview[]>([
    {
      id: 'rev-1',
      orderNumber: '#1039',
      tableNumber: '02',
      foodRating: 5,
      serviceRating: 5,
      cleanlinessRating: 5,
      overallRating: 5,
      comment: 'Super fast! Scanned QR and got burger within 12 minutes. Best smash burger in Lahore.',
      date: 'Today, 1:15 PM',
      wantsGoogleReviewRedirect: true,
    }
  ]);
  const [activeStationFilter, setActiveStationFilter] = useState<KitchenStation>('all');
  const [showWifiModal, setShowWifiModal] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Active order for current table
  const activeOrder = orders.find(
    o => o.tableNumber === selectedTable && o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  );

  const playOrderBell = () => {
    if (audioEnabled) {
      soundFX.playOrderBell();
    }
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if identical item with same addons exists
      const existingIdx = prev.findIndex(ci => 
        ci.menuItemId === item.menuItemId &&
        JSON.stringify(ci.selectedAddons) === JSON.stringify(item.selectedAddons) &&
        ci.specialInstructions === item.specialInstructions
      );

      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + item.quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          itemTotal: (next[existingIdx].basePrice + next[existingIdx].selectedAddons.reduce((s, a) => s + a.priceDelta, 0)) * newQty,
        };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(c => c.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.id === cartItemId) {
          const newQty = c.quantity + delta;
          if (newQty <= 0) return null;
          const unitPrice = c.basePrice + c.selectedAddons.reduce((s, a) => s + a.priceDelta, 0);
          return {
            ...c,
            quantity: newQty,
            itemTotal: unitPrice * newQty,
          };
        }
        return c;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const placeOrder = (paymentMethod: PaymentMethod, specialInstructions?: string) => {
    const subtotal = cart.reduce((s, item) => s + item.itemTotal, 0);
    const taxAmount = Math.round(subtotal * (RESTAURANT_INFO.taxRatePercent / 100));
    const serviceCharges = Math.round(subtotal * (RESTAURANT_INFO.serviceChargePercent / 100));
    const totalAmount = subtotal + taxAmount + serviceCharges;

    // Smart ETA calculation: Base prep + 2 mins per 3 items in kitchen
    const activeItemsInKitchen = orders
      .filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING')
      .reduce((sum, ord) => sum + ord.items.reduce((acc, it) => acc + it.quantity, 0), 0);
    const loadDelay = Math.min(15, Math.floor(activeItemsInKitchen / 3) * 2);
    const maxItemPrepTime = Math.max(...cart.map(i => {
      const found = menuItems.find(m => m.id === i.menuItemId);
      return found ? found.prepTimeMinutes : 15;
    }));
    const estimatedPrepTimeMinutes = maxItemPrepTime + loadDelay;

    const newOrderNumber = `#10${orders.length + 42}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableNumber: selectedTable,
      customerName: `Guest Table ${selectedTable}`,
      items: [...cart],
      subtotal,
      taxAmount,
      serviceCharges,
      discountAmount: 0,
      totalAmount,
      status: 'PENDING',
      paymentMethod,
      paymentStatus: (paymentMethod === 'JAZZCASH' || paymentMethod === 'EASYPAISA' || paymentMethod === 'BANK_CARD') 
        ? 'PAID' 
        : 'UNPAID',
      specialInstructions,
      estimatedPrepTimeMinutes,
      placedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Update table status
    setTables(prev => prev.map(t => 
      t.number === selectedTable ? { ...t, status: 'occupied', activeOrderId: newOrder.id } : t
    ));

    // Play chime for incoming order alert
    if (audioEnabled) {
      soundFX.playOrderBell();
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const now = new Date().toISOString();
        const updated = { ...ord, status: nextStatus };
        if (nextStatus === 'ACCEPTED') updated.acceptedAt = now;
        if (nextStatus === 'READY') {
          updated.preparedAt = now;
          if (audioEnabled) soundFX.playKitchenPing();
        }
        if (nextStatus === 'SERVED') {
          updated.servedAt = now;
          if (audioEnabled) soundFX.playSuccessArpeggio();
        }
        if (nextStatus === 'COMPLETED' || nextStatus === 'CANCELLED') {
          // Free table
          setTables(tPrev => tPrev.map(t => 
            t.number === ord.tableNumber ? { ...t, status: 'available', activeOrderId: undefined } : t
          ));
        }
        return updated;
      }
      return ord;
    }));
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o));
  };

  const callStaff = (type: ServiceRequest['type']) => {
    const newReq: ServiceRequest = {
      id: `req-${Date.now()}`,
      tableNumber: selectedTable,
      type,
      requestedAt: new Date().toISOString(),
      resolved: false,
    };
    setServiceRequests(prev => [newReq, ...prev]);
    if (audioEnabled) soundFX.playOrderBell();
  };

  const resolveStaffRequest = (requestId: string) => {
    setServiceRequests(prev => prev.map(r => r.id === requestId ? { ...r, resolved: true } : r));
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const submitReview = (reviewData: Omit<CustomerReview, 'id' | 'date'>) => {
    const newRev: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews(prev => [newRev, ...prev]);
    if (activeOrder) {
      setOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, feedbackGiven: true } : o));
    }
    if (audioEnabled) soundFX.playSuccessArpeggio();
  };

  return (
    <DineContext.Provider
      value={{
        role,
        setRole,
        selectedTable,
        setSelectedTable,
        menuItems,
        tables,
        orders,
        cart,
        serviceRequests,
        reviews,
        activeOrder,
        activeStationFilter,
        setActiveStationFilter,
        showWifiModal,
        setShowWifiModal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        callStaff,
        resolveStaffRequest,
        toggleItemAvailability,
        submitReview,
        audioEnabled,
        setAudioEnabled,
        playOrderBell,
      }}
    >
      {children}
    </DineContext.Provider>
  );
}

export function useDine() {
  const context = useContext(DineContext);
  if (!context) {
    throw new Error('useDine must be used within a DineProvider');
  }
  return context;
}
