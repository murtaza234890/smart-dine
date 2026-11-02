import { Order } from '../types/dining';
import { RESTAURANT_INFO } from '../data/mockRestaurant';

export function generateKOTText(order: Order, stationFilter?: string): string {
  const items = stationFilter && stationFilter !== 'all'
    ? order.items.filter(i => i.station === stationFilter)
    : order.items;

  const timeStr = new Date(order.acceptedAt || order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let text = `========================================\n`;
  text += `        KITCHEN ORDER TICKET (KOT)      \n`;
  text += `========================================\n`;
  text += `TABLE: ${order.tableNumber}               ORDER: ${order.orderNumber}\n`;
  text += `TIME:  ${timeStr}               TYPE: DINE-IN\n`;
  text += `STATION: ${(stationFilter || 'ALL STATIONS').toUpperCase()}\n`;
  text += `----------------------------------------\n`;
  text += `QTY  ITEM & MODIFIERS                   \n`;
  text += `----------------------------------------\n`;

  items.forEach(it => {
    text += `[${it.quantity}]  ${it.name.toUpperCase()}\n`;
    if (it.selectedAddons && it.selectedAddons.length > 0) {
      it.selectedAddons.forEach(a => {
        text += `     >> +${a.optionName.toUpperCase()}\n`;
      });
    }
    if (it.specialInstructions) {
      text += `     ** NOTE: ${it.specialInstructions.toUpperCase()} **\n`;
    }
  });

  text += `----------------------------------------\n`;
  if (order.specialInstructions) {
    text += `SPECIAL INSTRUCTIONS:\n`;
    text += `"${order.specialInstructions.toUpperCase()}"\n`;
    text += `----------------------------------------\n`;
  }
  text += `       SMARTDINE KITCHEN ROUTING        \n`;
  text += `========================================\n`;

  return text;
}

export function generateGuestBillText(order: Order, fbrInvoiceCode?: string): string {
  const timeStr = new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(order.placedAt).toLocaleDateString();

  let text = `========================================\n`;
  text += `      ${RESTAURANT_INFO.name.toUpperCase()}\n`;
  text += `  ${RESTAURANT_INFO.branch}\n`;
  text += `       NTN/PRA REG: 7492018-9          \n`;
  text += `========================================\n`;
  text += `BILL NO: ${order.orderNumber}          TABLE: ${order.tableNumber}\n`;
  text += `DATE:    ${dateStr}       TIME:  ${timeStr}\n`;
  text += `----------------------------------------\n`;
  text += `ITEM                      QTY     AMOUNT\n`;
  text += `----------------------------------------\n`;

  order.items.forEach(it => {
    const nameTruncated = it.name.length > 22 ? it.name.substring(0, 20) + '..' : it.name.padEnd(22);
    text += `${nameTruncated}  ${it.quantity.toString().padEnd(3)}   Rs.${it.itemTotal}\n`;
    if (it.selectedAddons && it.selectedAddons.length > 0) {
      it.selectedAddons.forEach(a => {
        text += `  + ${a.optionName}\n`;
      });
    }
  });

  text += `----------------------------------------\n`;
  text += `Subtotal:                     Rs. ${order.subtotal}\n`;
  text += `Govt. Sales Tax (PRA 16%):    Rs. ${order.taxAmount}\n`;
  text += `Service Charges (4%):         Rs. ${order.serviceCharges}\n`;
  if (order.discountAmount > 0) {
    text += `Promotional Discount:       - Rs. ${order.discountAmount}\n`;
  }
  text += `----------------------------------------\n`;
  text += `TOTAL PAYABLE:                Rs. ${order.totalAmount}\n`;
  text += `----------------------------------------\n`;
  text += `PAYMENT: ${order.paymentMethod.replace(/_/g, ' ')} (${order.paymentStatus})\n`;
  text += `----------------------------------------\n`;
  text += `FBR FISCAL CODE: ${fbrInvoiceCode || 'FBR-PK-HAVELI-847291'}\n`;
  text += `       FBR POS TIER-1 INTEGRATED        \n`;
  text += `========================================\n`;
  text += `   Shukriya! Rate us on Google Maps    \n`;
  text += `========================================\n`;

  return text;
}
