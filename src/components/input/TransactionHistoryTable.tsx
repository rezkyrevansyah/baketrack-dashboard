import { ClayCard } from '@/components/ui/ClayCard';
import { Pagination } from '@/components/ui/Pagination';
import { RowsPerPageSelector } from '@/components/ui/RowsPerPageSelector';
import { Search, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '@/services/api';
// import { formatDate, formatCurrency } from '@/utils/format';
import { formatDate } from '@/utils/format';
import { usePreferences } from '@/context/PreferencesContext';

type TransactionHistoryTableProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  tableData: Transaction[];
  sortConfig: { key: keyof Transaction; direction: 'asc' | 'desc' } | null;
  handleSort: (key: keyof Transaction) => void;
  productOptions: { value: string; icon: string }[];
  handleEdit: (t: Transaction) => void;
  confirmDelete: (t: Transaction) => void;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
  totalItems: number;
};

export function TransactionHistoryTable({
  searchQuery,
  setSearchQuery,
  tableData,
  sortConfig,
  handleSort,
  productOptions,
  handleEdit,
  confirmDelete,
  currentPage,
  totalPages,
  goToPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems
}: TransactionHistoryTableProps) {
  const { t, formatPrice, language } = usePreferences();
  return (
    <div className="mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
           <h3 className="text-2xl font-black text-bakery-text flex items-center gap-2">
             🕒 {t('history.title')}
           </h3>
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPageSelector value={itemsPerPage} onChange={setItemsPerPage} />
              <div className="relative group w-full sm:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                 <input 
                   type="text" 
                   placeholder={t('search_placeholder')} 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="clay-input !pl-11 !py-3 w-full !text-sm !bg-white focus:!border-pink-300"
                 />
              </div>
           </div>
        </div>
        
        <div className="clay-card-static !bg-white !rounded-[32px] overflow-hidden shadow-clay-card p-0">
          <div className="overflow-x-auto w-full max-w-full scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-pink-50/50 text-bakery-muted uppercase text-xs font-black tracking-widest">
                <tr>
                   <th className="px-3 md:px-6 py-5 w-12 md:w-16 text-center">No</th>
                   <th 
                    className="px-3 md:px-6 py-5 cursor-pointer hover:bg-pink-100/50 transition-colors select-none"
                    onClick={() => handleSort('date')}
                   >
                     <div className="flex items-center gap-2">
                       {t('date')}
                       {sortConfig?.key === 'date' && (
                         sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                       )}
                     </div>
                   </th>
                   <th className="px-3 md:px-6 py-5 min-w-[140px] md:min-w-0">{t('product')}</th>
                   <th className="px-3 md:px-6 py-5 text-right whitespace-nowrap">{t('qty')}</th>
                   <th 
                    className="px-3 md:px-6 py-5 text-right cursor-pointer hover:bg-pink-100/50 transition-colors select-none whitespace-nowrap"
                    onClick={() => handleSort('total')}
                   >
                     <div className="flex items-center justify-end gap-2">
                       {t('total')}
                       {sortConfig?.key === 'total' && (
                         sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                       )}
                     </div>
                   </th>
                   <th className="px-3 md:px-6 py-5 text-center whitespace-nowrap">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                 {tableData.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-pink-50/10 transition-colors group">
                       <td className="px-3 md:px-6 py-4 font-bold text-bakery-muted text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                       </td>
                       <td className="px-3 md:px-6 py-4 font-bold text-bakery-text whitespace-nowrap">
                         {formatDate(item.date, language)}
                       </td>
                       <td className="px-3 md:px-6 py-4 font-bold text-bakery-text flex items-center gap-2 md:gap-3 min-w-[140px] md:min-w-0">
                         <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm border border-gray-100">
                           {productOptions.find(p => p.value === item.product)?.icon || '📦'}
                         </span>
                         {item.product}
                       </td>
                       <td className="px-3 md:px-6 py-4 font-bold text-bakery-text text-right">
                         {item.qty}
                       </td>
                       <td className="px-3 md:px-6 py-4 font-bold text-bakery-pink text-right whitespace-nowrap">
                         {formatPrice(item.total)}
                       </td>
                       <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2 transition-opacity">
                             <button 
                               onClick={() => handleEdit(item)} 
                               className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
                               title={t('common.edit') || "Edit"}
                             >
                                <Edit2 size={16} />
                             </button>
                             <button 
                                onClick={() => confirmDelete(item)}
                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                                title={t('common.delete') || "Hapus"}
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {tableData.length === 0 && (
                    <tr>
                       <td colSpan={6} className="py-12 text-center text-bakery-muted font-bold opacity-50">
                          {searchQuery ? t('common.not_found') : t('common.no_data')}
                       </td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>
  );
}
