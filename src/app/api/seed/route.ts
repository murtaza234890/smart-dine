import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { RestaurantModel } from '../../../models/Restaurant';
import { CategoryModel } from '../../../models/Category';
import { MenuItemModel } from '../../../models/MenuItem';
import { TableModel } from '../../../models/Table';
import { UserModel } from '../../../models/User';
import { OrderModel } from '../../../models/Order';
import { ServiceRequestModel } from '../../../models/ServiceRequest';
import { ReviewModel } from '../../../models/Review';
import { RESTAURANT_INFO, CATEGORIES, MENU_ITEMS, INITIAL_ORDERS, INITIAL_TABLES } from '../../../data/mockRestaurant';

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'No MONGODB_URI environment variable detected. Running in in-memory mode.',
      });
    }

    // 1. Seed / Upsert Restaurant Tenant
    await RestaurantModel.findOneAndUpdate(
      { slug: 'haveli' },
      {
        name: RESTAURANT_INFO.name,
        slug: 'haveli',
        tagline: RESTAURANT_INFO.tagline,
        city: 'Lahore & Islamabad',
        ownerName: 'Murtaza Ali & Partners',
        ownerPhone: '0300-8451920',
        wifiSsid: RESTAURANT_INFO.wifiSsid,
        wifiPassword: RESTAURANT_INFO.wifiPassword,
        googleReviewUrl: RESTAURANT_INFO.googleReviewUrl,
        taxRatePercent: RESTAURANT_INFO.taxRatePercent,
        serviceChargePercent: RESTAURANT_INFO.serviceChargePercent,
        currency: RESTAURANT_INFO.currency,
        tableCount: RESTAURANT_INFO.tableCount,
        plan: 'Enterprise',
        subscriptionStatus: 'ACTIVE',
        fbrPosEnabled: true,
        branches: [
          {
            name: 'Gulberg Flagship Branch',
            city: 'Lahore',
            address: 'Main Boulevard, Gulberg III',
            phone: '042-35789001',
          },
          {
            name: 'DHA Phase 5 Executive Branch',
            city: 'Lahore',
            address: 'Sector C Commercial, DHA Phase 5',
            phone: '042-35789002',
          },
          {
            name: 'Islamabad F-7 Markaz Branch',
            city: 'Islamabad',
            address: 'College Road, F-7 Markaz',
            phone: '051-2654321',
          },
        ],
      },
      { upsert: true, new: true }
    );

    // 2. Seed Categories
    for (let i = 0; i < CATEGORIES.length; i++) {
      const cat = CATEGORIES[i];
      await CategoryModel.findOneAndUpdate(
        { restaurantSlug: 'haveli', name: cat.name },
        {
          restaurantSlug: 'haveli',
          name: cat.name,
          nameUrdu: cat.nameUrdu,
          icon: cat.icon,
          displayOrder: i + 1,
          isActive: true,
        },
        { upsert: true }
      );
    }

    // 3. Seed Menu Items & Variant Groups
    for (const item of MENU_ITEMS) {
      await MenuItemModel.findOneAndUpdate(
        { restaurantSlug: 'haveli', name: item.name },
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
        { upsert: true }
      );
    }

    // 4. Seed Dining Tables
    for (let i = 0; i < INITIAL_TABLES.length; i++) {
      const tbl = INITIAL_TABLES[i];
      const sectionName = i < 4 
        ? 'Indoor Main Hall' 
        : i < 8 
        ? 'Rooftop Terrace' 
        : i < 10 
        ? 'Executive Family Lounge' 
        : 'Patio Garden';

      await TableModel.findOneAndUpdate(
        { restaurantSlug: 'haveli', tableNumber: tbl.number },
        {
          restaurantSlug: 'haveli',
          tableNumber: tbl.number,
          capacity: tbl.capacity,
          section: sectionName,
          status: tbl.status,
          activeOrderId: tbl.activeOrderId,
          qrToken: `QR-HAVELI-TBL-${tbl.number}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
        { upsert: true }
      );
    }

    // 5. Seed Staff Accounts (Users)
    const staffList = [
      { name: 'Capt. Tariq Mehmood', email: 'tariq@haveli.pk', phone: '0300-1122334', role: 'RESTAURANT_ADMIN', posPin: '1001' },
      { name: 'Chef Aslam Grillmaster', email: 'aslam@haveli.pk', phone: '0301-2233445', role: 'KITCHEN_STAFF', posPin: '2001' },
      { name: 'Waiter Bilal Khan', email: 'bilal@haveli.pk', phone: '0302-3344556', role: 'WAITER', posPin: '3001' },
      { name: 'Waiter Hamza Riaz', email: 'hamza@haveli.pk', phone: '0303-4455667', role: 'WAITER', posPin: '3002' },
    ];
    for (const staff of staffList) {
      await UserModel.findOneAndUpdate(
        { restaurantSlug: 'haveli', email: staff.email },
        {
          restaurantSlug: 'haveli',
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          role: staff.role as any,
          posPin: staff.posPin,
          isActive: true,
        },
        { upsert: true }
      );
    }

    // 6. Seed Sample Active Orders
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      for (const ord of INITIAL_ORDERS) {
        await OrderModel.create({
          ...ord,
          restaurantSlug: 'haveli',
        });
      }
    }

    // 7. Seed Sample Service Requests
    await ServiceRequestModel.deleteMany({ restaurantSlug: 'haveli' });
    await ServiceRequestModel.create([
      { restaurantSlug: 'haveli', tableNumber: '04', type: 'Water', resolved: false },
      { restaurantSlug: 'haveli', tableNumber: '08', type: 'Bill Receipt', resolved: false },
    ]);

    // 8. Seed Sample Customer Reviews
    await ReviewModel.deleteMany({ restaurantSlug: 'haveli' });
    await ReviewModel.create([
      {
        restaurantSlug: 'haveli',
        orderNumber: '#1039',
        tableNumber: '02',
        foodRating: 5,
        serviceRating: 5,
        cleanlinessRating: 5,
        overallRating: 5,
        comment: 'Best smash burger in Lahore! Got my food in 12 minutes straight after scanning table QR.',
        wantsGoogleReviewRedirect: true,
      },
      {
        restaurantSlug: 'haveli',
        orderNumber: '#1040',
        tableNumber: '05',
        foodRating: 5,
        serviceRating: 4,
        cleanlinessRating: 5,
        overallRating: 5,
        comment: 'Shinwari mutton karahi was exceptionally tender. Digital bill payment via JazzCash worked in seconds.',
        wantsGoogleReviewRedirect: true,
      },
    ]);

    const totalCategories = await CategoryModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalMenu = await MenuItemModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalTables = await TableModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalStaff = await UserModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalOrders = await OrderModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalRequests = await ServiceRequestModel.countDocuments({ restaurantSlug: 'haveli' });
    const totalReviews = await ReviewModel.countDocuments({ restaurantSlug: 'haveli' });

    return NextResponse.json({
      success: true,
      message: 'MongoDB Atlas Enterprise Database Architecture successfully seeded across 8 collections!',
      database: 'MongoDB Atlas',
      collectionsCreated: {
        restaurants: 1,
        branches: 3,
        categories: totalCategories,
        menuItems: totalMenu,
        tables: totalTables,
        staffUsers: totalStaff,
        orders: totalOrders,
        serviceRequests: totalRequests,
        customerReviews: totalReviews,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database seeding failed', details: String(error) },
      { status: 500 }
    );
  }
}
