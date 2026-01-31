import { useMemo } from 'react';
import { Transaction, Product, FullDashboardData } from '@/types/dashboard';

export interface ReportStats {
  omzet: string;
  laba: string;
  aov: string;
  margin: string;
  totalTx: number;
  rawOmzet: number;
}

export function useReportStats(
  transactions: Transaction[], 
  products: Product[],
  formatPrice: (value: number) => string
) {
  return useMemo(() => {
    const totalOmzet = transactions.reduce((sum, t) => sum + Number(t.total), 0);
    
    // Calculate profit based on: (Sales Price - Cost Price) * Qty
    const totalLaba = transactions.reduce((sum, t) => {
      const product = products.find(p => p.name === t.product);
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
  }, [transactions, products, formatPrice]);
}

export function useTopProducts(transactions: Transaction[], products: Product[]) {
  return useMemo(() => {
    const counts: Record<string, { name: string, sold: number, icon: string }> = {};
    const defaultIcons: Record<string, string> = { 'Cupcake': '🧁', 'Donat': '🍩', 'Croissant': '🥐', 'Roti': '🍞', 'Cake': '🍰' };

    transactions.forEach(t => {
      const pName = t.product.trim();
      if (!counts[pName]) {
        const productInfo = products.find(p => p.name === pName);
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
  }, [transactions, products]);
}

export function useWeeklyData(transactions: Transaction[], products: Product[]) {
  return useMemo(() => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const result = days.map(day => ({ day, omzet: 0, laba: 0 }));

    transactions.forEach(t => {
      try {
        const date = new Date(t.date);
        if (!isNaN(date.getTime())) {
             const dayIdx = date.getDay();
             const omzet = Number(t.total);
             
             // Calculate profit per transaction
             const product = products.find(p => p.name === t.product);
             const costPrice = product?.costPrice || 0;
             const profit = (t.price - costPrice) * Number(t.qty);

             result[dayIdx].omzet += omzet;
             result[dayIdx].laba += profit;
        }
      } catch (e) {}
    });

    return [...result.slice(1), result[0]];
  }, [transactions, products]);
}
