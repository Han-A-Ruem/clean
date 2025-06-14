
import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import PaymentMethodsList from '@/components/more/payment/PaymentMethodsList';
import PaymentMethodForm from '@/components/more/payment/PaymentMethodForm';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

// Separate component for editing payment methods
const PaymentMethodEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { paymentMethods, isLoading } = usePaymentMethods();
  
  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }
  
  const method = paymentMethods.find(m => m.id === id);
  
  if (!method) {
    return <Navigate to="/more/payment" />;
  }
  
  return <PaymentMethodForm initialData={method} isEdit={true} />;
};

const PaymentManagement: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentMethodsList />} />
      <Route path="/add" element={<PaymentMethodForm />} />
      <Route path="/edit/:id" element={<PaymentMethodEdit />} />
    </Routes>
  );
};

export default PaymentManagement;
