import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { RestaurantModel } from '../../../models/Restaurant';
import { MenuItemModel } from '../../../models/MenuItem';
import { OrderModel } from '../../../models/Order';
import { RESTAURANT_INFO, MENU_ITEMS, INITIAL_ORDERS } from '../../../data/mockRestaurant';

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'No MONGODB_URI environment variable detected. Running in in-memory mode.',
      });
    }

    // 1. Seed or Upsert Restaurant
    await RestaurantModel.findOneAndUpdate(
      { slug: 'haveli' },
      {
        name: RESTAURANT_INFO.name,
        slug: 'haveli',
        tagline: RESTAURANT_INFO.tagline,
        branch: RESTAURANT_INFO.branch,
        wifiSsid: RESTAURANT_INFO.wifiSsid,
        wifiPassword: RESTAURANT_INFO.wifiPassword,
        googleReviewUrl: RESTAURANT_INFO.googleReviewUrl,
        taxRatePercent: RESTAURANT_INFO.taxRatePercent,
        serviceChargePercent: RESTAURANT_INFO.serviceChargePercent,
        currency: RESTAURANT_INFO.currency,
        tableCount: RESTAURANT_INFO.tableCount,
        plan: 'Enterprise',
        fbrPosEnabled: true,
      },
      { upsert: true, new: true }
    );

    // 2. Seed Menu Items
    for (const item of MENU_ITEMS) {
      await MenuItemModel.findOneAndUpdate(
        { name: item.name, restaurantSlug: 'haveli' },
        {
          restaurantSlug: 'haveli',
          categoryId: item.categoryId,
          name: item.name,
          nameUrdu: item.nameUrdu,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg,
          isPopular: !!item.isPopular,
          isChefSpecial: !!item.isChefSpecial,
          isAvailable: item.isAvailable,
          prepTimeMinutes: item.prepTimeMinutes,
          station: item.station,
          variantGroups: item.variantGroups,
        },
        { upsert: true, new: true }
      );
    }

    // 3. Seed Sample Orders if empty
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      for (const ord of INITIAL_ORDERS) {
        await OrderModel.create({
          ...ord,
          restaurantSlug: 'haveli',
        });
      }
    }

    const totalMenu = await MenuItemModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalOrders = await OrderModel.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'MongoDB Atlas successfully initialized and seeded with SmartDine data!',
      database: 'MongoDB Atlas',
      seeded: {
        restaurant: RESTAURANT_INFO.name,
        menuItemsCount: totalMenu,
        ordersCount: totalOrders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database seeding failed', details: String(error) },
      { status: 500 }
    );
  }
}
