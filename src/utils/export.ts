import { Transaction } from '@/types/dashboard';

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
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
