'use client';

import React, { useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDine } from '../../../context/DineContext';
import { CustomerView } from '../../../components/customer/CustomerView';
import { RoleSwitcher } from '../../../components/RoleSwitcher';
import { DemoSimulationToolkit } from '../../../components/DemoSimulationToolkit';

export default function RestaurantTablePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table');
  const { setSelectedTable, selectedTable } = useDine();

  useEffect(() => {
    if (tableParam) {
      const formatted = tableParam.padStart(2, '0');
      setSelectedTable(formatted);
    }
  }, [tableParam, setSelectedTable]);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans">
      <RoleSwitcher />

      {/* Table Welcome Notice */}
      <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 border-b border-orange-500/30 px-4 py-2 text-center text-xs text-orange-200">
        ✨ Welcome to <strong>{slug.toUpperCase()}</strong>! You are viewing the live contactless menu for <strong>Table {selectedTable}</strong>.
      </div>

      <div className="flex-1">
        <CustomerView />
      </div>

      <DemoSimulationToolkit />
    </div>
  );
}
