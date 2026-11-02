'use client';

import React from 'react';
import { useDine } from '../context/DineContext';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { CustomerView } from '../components/customer/CustomerView';
import { WaiterDashboard } from '../components/waiter/WaiterDashboard';
import { KitchenDisplay } from '../components/kitchen/KitchenDisplay';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { SuperAdminPortal } from '../components/admin/SuperAdminPortal';
import { DemoSimulationToolkit } from '../components/DemoSimulationToolkit';

export default function Home() {
  const { role } = useDine();

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans">
      {/* Top Role Switcher */}
      <RoleSwitcher />

      {/* Main Dynamic View */}
      <div className="flex-1">
        {role === 'customer' && <CustomerView />}
        {role === 'waiter' && <WaiterDashboard />}
        {role === 'kitchen' && <KitchenDisplay />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'super_admin' && <SuperAdminPortal />}
      </div>

      {/* Floating Demo Simulation Toolkit */}
      <DemoSimulationToolkit />
    </div>
  );
}
