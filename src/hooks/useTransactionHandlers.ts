import { useState } from 'react';
import { submitTransaction, deleteTransaction, Transaction } from '@/services/api';

interface FormData {
  date: string;
  product: string;
  qty: number | '';
  price: number;
}

interface UseTransactionHandlersProps {
  refreshData: () => Promise<void>;
}

export function useTransactionHandlers({ refreshData }: UseTransactionHandlersProps) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    product: '',
    qty: '',
    price: 0
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      qty: '',
      price: 0
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product) return;
    
    setLoading(true);
    
    const finalQty = formData.qty === '' ? 1 : formData.qty;
    const finalTotal = finalQty * formData.price;
    
    const transactionData: Transaction = {
      ...formData, 
      qty: finalQty,
      total: finalTotal,
      id: editingId || undefined
    };

    const success = await submitTransaction(transactionData, !!editingId);
    
    if (success) {
      await refreshData();
      resetForm();
    } else {
      alert('Gagal menyimpan ke Google Sheets. Silakan coba lagi.');
    }
    setLoading(false);
  };

  const handleEdit = (t: Transaction) => {
    let dateStr = '';
    try {
      const d = new Date(t.date);
      dateStr = d.toISOString().split('T')[0];
    } catch (e) {
      dateStr = ''; 
    }

    setFormData({
      date: dateStr,
      product: t.product.trim(), 
      qty: t.qty,
      price: t.price
    });
    setEditingId(t.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (t: Transaction) => {
    setTransactionToDelete(t);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!transactionToDelete?.id) return;
    setLoading(true);
    const success = await deleteTransaction(transactionToDelete.id);
    if (success) {
      await refreshData();
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    } else {
      alert('Gagal menghapus transaksi.');
    }
    setLoading(false);
  };

  const handleProductChange = (productValue: string, productOptions: { value: string; price: number }[]) => {
    const selected = productOptions.find(p => p.value === productValue);
    setFormData(prev => ({
      ...prev,
      product: productValue,
      price: selected ? Number(selected.price) : prev.price
    }));
  };

  return {
    loading,
    formData,
    setFormData,
    editingId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    transactionToDelete,
    resetForm,
    handleSubmit,
    handleEdit,
    confirmDelete,
    handleDelete,
    handleProductChange,
    total: (formData.qty === '' ? 0 : formData.qty) * formData.price
  };
}
