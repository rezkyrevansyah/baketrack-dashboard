'use client';

import { ClayButton } from '@/components/ui/ClayButton';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { useTable } from '@/hooks/useTable';
import { SummaryCards } from '@/components/report/SummaryCards';
import { TopProductsCard } from '@/components/report/TopProductsCard';
import { WeeklyChart } from '@/components/report/WeeklyChart';
import { ReportTable } from '@/components/report/ReportTable';
import { usePreferences } from '@/context/PreferencesContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GlobalToolbar } from '@/components/ui/GlobalToolbar';
import { useReportStats, useTopProducts, useWeeklyData } from '@/hooks/useReportData';
import { exportTransactionsToCSV } from '@/utils/export';

export default function ReportPage() {
  const { data, loading } = useDashboard();
  const { t, formatPrice } = usePreferences();
  const transactions = data?.transactions || [];
  const products = data?.products || [];

  // 1. Calculate Summary Stats
  const stats = useReportStats(transactions, products, formatPrice);

  // 2. Calculate Top Products
  const topProducts = useTopProducts(transactions, products);

  // 3. Weekly Data Aggregation
  const weeklyData = useWeeklyData(transactions, products);

  // 4. Data Table Logic
  const { 
    data: tableData,
    totalPages,
    currentPage,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    goToPage,
    itemsPerPage, 
    setItemsPerPage,
    totalItems
  } = useTable({
    data: transactions || [],
    itemsPerPage: 5, 
    initialSort: { key: 'date', direction: 'desc' },
    filterFn: (item, query) => item.product.toLowerCase().includes(query.toLowerCase())
  });

  // 5. CSV Export Logic
  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
  };

  if (loading && !data) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* --- HEADER (MATCHING INPUT PAGE STRUCTURE) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4 md:pt-6">
        <div>
          <h1 className="text-4xl font-black text-bakery-text tracking-tight mb-2">
            {t('report.title')}
          </h1>
          <p className="text-bakery-muted font-bold text-sm tracking-wide opacity-70 uppercase">
             {t('report.subtitle')}
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col items-center xl:flex-row gap-4">
           {/* Unified Toolbar Container */}
           <GlobalToolbar />

           {/* Primary Action */}
           <Link href="/input" className="flex-1 md:flex-none w-full md:w-auto">
              <ClayButton className="w-full md:w-auto h-14 px-8 flex items-center justify-center gap-3 text-sm font-black !rounded-[20px] bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white shadow-lg hover:shadow-pink-200/50 hover:-translate-y-1 transition-all group">
                <Plus size={22} strokeWidth={3} className="text-white/90 group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">INPUT SALES</span>
              </ClayButton>
           </Link>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 gap-8 px-4 pb-12">
          
          {/* 1. Top Row: Stats + Top Products (4 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <SummaryCards stats={stats} />
             <TopProductsCard products={topProducts} />
          </div>

          {/* 2. Middle Row: Charts */}
          <div className="w-full space-y-2">
             <div className="flex items-center justify-between px-1">
               <h3 className="text-lg font-black text-bakery-text/80">{t('report.weekly_chart')}</h3>
             </div>
             <WeeklyChart data={weeklyData} />
          </div>

          {/* 3. Detailed Transaction Table */}
          <div className="space-y-2">
             <ReportTable 
              totalTx={stats.totalTx}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleExportCSV={handleExportCSV}
              tableData={tableData}
              sortConfig={sortConfig}
              handleSort={handleSort}
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={totalItems}
            />
          </div>
      </div>
    </div>
  );
}
