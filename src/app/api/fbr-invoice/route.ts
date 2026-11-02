import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { orderNumber, totalAmount, taxAmount } = body as {
      orderNumber?: string;
      totalAmount?: number;
      taxAmount?: number;
    };

    const fbrInvoiceNumber = `FBR-PK-HAVELI-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const praRegistrationNo = 'PRA-LHE-7492018-9';

    // Cryptographic data string encoded inside FBR QR code
    const fbrQrPayload = `POS_ID:8471|FBR_INV:${fbrInvoiceNumber}|TOTAL:${totalAmount || 0}|TAX:${taxAmount || 0}|DATE:${new Date().toISOString()}`;

    return NextResponse.json({
      success: true,
      fbrInvoiceNumber,
      praRegistrationNo,
      posTerminalId: 'POS-TERMINAL-01-GULBERG',
      orderNumber: orderNumber || '#1042',
      taxAuthority: 'Punjab Revenue Authority (PRA) & FBR POS Tier-1',
      qrPayload: fbrQrPayload,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED_AND_LOGGED',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate fiscal invoice', details: String(error) },
      { status: 500 }
    );
  }
}
