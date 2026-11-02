import { NextResponse } from 'next/server';
import { INITIAL_ORDERS, RESTAURANT_INFO } from '../../../data/mockRestaurant';
import { Order } from '../../../types/dining';
import { connectToDatabase } from '../../../lib/mongodb';
import { OrderModel } from '../../../models/Order';

// In-memory fallback orders store for offline / local session
let runtimeOrders: Order[] = [...INITIAL_ORDERS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const table = searchParams.get('table');

  const db = await connectToDatabase();
  if (db) {
    try {
      const query: Record<string, unknown> = {};
      if (status && status !== 'all') query.status = status;
      if (table) query.tableNumber = table;

      const mongoOrders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      if (mongoOrders.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'MongoDB Atlas',
          count: mongoOrders.length,
          orders: mongoOrders.map(doc => ({
            ...doc,
            id: String(doc._id),
          })),
        });
      }
    } catch (e) {
      console.warn('MongoDB read error, falling back to memory:', e);
    }
  }

  // Fallback to in-memory store
  let results = runtimeOrders;
  if (status && status !== 'all') {
    results = results.filter(o => o.status === status);
  }
  if (table) {
    results = results.filter(o => o.tableNumber === table);
  }

  return NextResponse.json({
    success: true,
    source: 'Runtime Memory',
    count: results.length,
    orders: results,
  });
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload in request' },
        { status: 400 }
      );
    }

    const { tableNumber, items, paymentMethod, specialInstructions, customerName, customerPhone } = body as {
      tableNumber?: string;
      items?: Array<{ itemTotal: number }>;
      paymentMethod?: string;
      specialInstructions?: string;
      customerName?: string;
      customerPhone?: string;
    };

    if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Table number and items are required' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((sum: number, it: { itemTotal: number }) => sum + it.itemTotal, 0);
    const taxAmount = Math.round(subtotal * (RESTAURANT_INFO.taxRatePercent / 100));
    const serviceCharges = Math.round(subtotal * (RESTAURANT_INFO.serviceChargePercent / 100));
    const totalAmount = subtotal + taxAmount + serviceCharges;

    // Smart ETA Calculation
    const activeOrdersCount = runtimeOrders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING').length;
    const loadDelay = Math.min(15, activeOrdersCount * 2);
    const estimatedPrepTimeMinutes = 14 + loadDelay;

    const newOrderNumber = `#10${runtimeOrders.length + 43}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableNumber,
      customerName: customerName || `Guest Table ${tableNumber}`,
      customerPhone,
      items: items as Order['items'],
      subtotal,
      taxAmount,
      serviceCharges,
      discountAmount: 0,
      totalAmount,
      status: 'PENDING',
      paymentMethod: (paymentMethod || 'CASH_AT_TABLE') as Order['paymentMethod'],
      paymentStatus: (paymentMethod === 'JAZZCASH' || paymentMethod === 'EASYPAISA' || paymentMethod === 'BANK_CARD') 
        ? 'PAID' 
        : 'UNPAID',
      specialInstructions,
      estimatedPrepTimeMinutes,
      placedAt: new Date().toISOString(),
    };

    runtimeOrders = [newOrder, ...runtimeOrders];

    // Persist to MongoDB Atlas if connected
    const db = await connectToDatabase();
    if (db) {
      try {
        const savedDoc = await OrderModel.create({
          ...newOrder,
          restaurantSlug: 'haveli',
        });
        return NextResponse.json({
          success: true,
          source: 'MongoDB Atlas',
          message: 'Order created and persisted to MongoDB Atlas',
          order: {
            ...newOrder,
            id: String(savedDoc._id),
          },
        }, { status: 201 });
      } catch (dbErr) {
        console.warn('MongoDB save error, kept in memory:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      source: 'Runtime Memory',
      message: 'Order created successfully',
      order: newOrder,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process order', details: String(error) },
      { status: 500 }
    );
  }
}
