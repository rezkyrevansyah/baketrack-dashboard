'use client';

import { useMemo } from 'react';
import { ClayButton } from '@/components/ui/ClayButton';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { SyncButton } from '@/components/ui/SyncButton';
import { useTable } from '@/hooks/useTable';
import { SummaryCards } from '@/components/report/SummaryCards';
import { TopProductsCard } from '@/components/report/TopProductsCard';
import { WeeklyChart } from '@/components/report/WeeklyChart';
import { ReportTable } from '@/components/report/ReportTable';
import { usePreferences } from '@/context/PreferencesContext';
import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GlobalToolbar } from '@/components/ui/GlobalToolbar';

export default function ReportPage() {
  const { data, loading } = useDashboard();
  const { t, formatPrice, exchangeRate } = usePreferences();
  const transactions = data?.transactions || [];

  // 1. Calculate Summary Stats
  const stats = useMemo(() => {
    const totalOmzet = transactions.reduce((sum, t) => sum + Number(t.total), 0);
    
    // Calculate profit based on: (Sales Price - Cost Price) * Qty
    const totalLaba = transactions.reduce((sum, t) => {
      const product = data?.products.find(p => p.name === t.product);
      const costPrice = product?.costPrice || 0;
      const profitPerItem = t.price - costPrice; // Sales Price - Cost Price
      return sum + (profitPerItem * Number(t.qty));
    }, 0);

    const totalTx = transactions.length;
    const aov = totalTx > 0 ? totalOmzet / totalTx : 0;

    const marginPercentage = totalOmzet > 0 ? (totalLaba / totalOmzet) * 100 : 0;

    return {
      omzet: formatPrice(totalOmzet),
      laba: formatPrice(totalLaba),
      aov: formatPrice(aov),
      margin: `${marginPercentage.toFixed(1)}%`,
      totalTx,
      rawOmzet: totalOmzet
    };
  }, [transactions, formatPrice, exchangeRate, data]);

  // 2. Calculate Top Products
  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string, sold: number, icon: string }> = {};
    const defaultIcons: Record<string, string> = { 'Cupcake': '🧁', 'Donat': '🍩', 'Croissant': '🥐', 'Roti': '🍞', 'Cake': '🍰' };

    transactions.forEach(t => {
      const pName = t.product.trim();
      if (!counts[pName]) {
        const productInfo = data?.products.find(p => p.name === pName);
        counts[pName] = { 
          name: pName, 
          sold: 0, 
          icon: productInfo?.image || Object.entries(defaultIcons).find(([k]) => pName.includes(k))?.[1] || '🥯'
        };
      }
      counts[pName].sold += Number(t.qty);
    });

    return Object.values(counts)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3);
  }, [transactions, data, exchangeRate]);

  // 3. Weekly Data Aggregation
  const weeklyData = useMemo(() => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const result = days.map(day => ({ day, omzet: 0, laba: 0 }));

    transactions.forEach(t => {
      try {
        const date = new Date(t.date);
        if (!isNaN(date.getTime())) {
             const dayIdx = date.getDay();
             const omzet = Number(t.total);
             
             // Calculate profit per transaction
             const product = data?.products.find(p => p.name === t.product);
             const costPrice = product?.costPrice || 0;
             const profit = (t.price - costPrice) * Number(t.qty);

             result[dayIdx].omzet += omzet;
             result[dayIdx].laba += profit;
        }
      } catch (e) {}
    });

    return [...result.slice(1), result[0]];
  }, [transactions, exchangeRate, data]);

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
    const headers = ['Tanggal', 'Produk', 'Qty', 'Harga', 'Total'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.product}"`, // Escape quotes
      t.qty,
      t.price,
      t.total
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
