import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body in request' },
        { status: 400 }
      );
    }

    const { gateway, amount, accountOrPhone, orderNumber } = body as {
      gateway?: string;
      amount?: number;
      accountOrPhone?: string;
      orderNumber?: string;
    };

    if (!gateway || !amount) {
      return NextResponse.json(
        { success: false, error: 'Gateway and amount are required' },
        { status: 400 }
      );
    }

    const prefix = gateway === 'JAZZCASH' ? 'JC' : gateway === 'EASYPAISA' ? 'EP' : 'CARD';
    const txnRefNo = `${prefix}-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    return NextResponse.json({
      success: true,
      status: 'TRANSACTION_SUCCESSFUL',
      gateway,
      amount,
      currency: 'PKR',
      transactionReference: txnRefNo,
      orderNumber: orderNumber || '#1042',
      customerAccount: accountOrPhone || '0300-XXXXXXX',
      verifiedAt: new Date().toISOString(),
      merchantName: 'Haveli & Co. Digital Dining POS',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Payment gateway verification error', details: String(error) },
      { status: 500 }
    );
  }
}
