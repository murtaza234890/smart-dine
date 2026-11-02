import { NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '../../../../types/dining';
import { connectToDatabase } from '../../../../lib/mongodb';
import { OrderModel } from '../../../../models/Order';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { status, paymentStatus } = body as {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
    };

    const updateFields: Record<string, unknown> = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      updatedAt: new Date().toISOString(),
    };

    if (status === 'ACCEPTED') updateFields.acceptedAt = new Date().toISOString();
    if (status === 'READY') updateFields.preparedAt = new Date().toISOString();
    if (status === 'SERVED') updateFields.servedAt = new Date().toISOString();

    const db = await connectToDatabase();
    if (db) {
      try {
        await OrderModel.findOneAndUpdate(
          { $or: [{ _id: id }, { id }, { orderNumber: id }] },
          { $set: updateFields },
          { new: true }
        );
      } catch (err) {
        console.warn('MongoDB patch error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order ${id} updated successfully`,
      updatedFields: updateFields,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update order', details: String(error) },
      { status: 500 }
    );
  }
}
